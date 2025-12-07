from langchain_ollama.llms import OllamaLLM
from langchain.prompts import PromptTemplate
import re
import os

# Initialize Ollama LLM
llm = OllamaLLM(model=os.getenv('OLLAMA_MODEL', 'mistral'))

# GraphQL Schema Context
SCHEMA_CONTEXT = """
You are an expert GraphQL query generator for the CLP Alumni Directory system.

Available Types:
1. Alumni: _id, Alumni_id, Name, Email, Graduation_year, Field_of_study[], Employer, Employment_title, Employer_location{City, State}, Employment_status, Phone, Address
2. Event: _id, Event_id, Name, Description, Location, Date, Time, Capacity, Organizer_id
3. Reservation: _id, Reservation_id, Alumni_id, Event_id, Number_of_attendees, Payment_amount, Payment_status
4. Photo: _id, Photo_id, File_id, File_name, Alumni_id, Event_id, Tags[]
5. Admin: _id, Admin_id, Username, Role, Email

Available Queries:
- getAlumni: Get all alumni
- getAlumniById(id: ID!): Get alumni by MongoDB _id
- getAlumniByAlumniId(Alumni_id: String!): Get alumni by Alumni_id
- getAlumniByEmail(Email: String!): Get alumni by email
- getAlumniByEmployer(Employer: String!): Get alumni by employer name
- getEvents: Get all events
- getEventById(id: ID!): Get event by MongoDB _id
- getEventByEventId(Event_id: String!): Get event by Event_id
- getEventsByDate(Date: String!): Get events by date
- getReservations: Get all reservations
- getReservationsByAlumni(Alumni_id: String!): Get reservations by alumni
- getReservationsByEvent(Event_id: String!): Get reservations by event
- getPhotos: Get all photos
- getPhotosByEvent(Event_id: String!): Get photos by event
- getPhotosByTags(Tags: [String!]!): Get photos by tags
- getAdmins: Get all admins

Available Mutations:
- createAlumni(input: AlumniInput!): Create new alumni
- updateAlumni(id: ID!, input: AlumniUpdateInput!): Update alumni
- deleteAlumni(id: ID!): Delete alumni
- createEvent(input: EventInput!): Create new event
- updateEvent(id: ID!, input: EventUpdateInput!): Update event
- deleteEvent(id: ID!): Delete event
- createReservation(input: ReservationInput!): Create new reservation
- updateReservation(id: ID!, input: ReservationUpdateInput!): Update reservation
- deleteReservation(id: ID!): Delete reservation
- createPhoto(input: PhotoInput!): Create new photo
- loginAlumni(Email: String!, Password: String!): Alumni login
- loginAdmin(Username: String!, Password: String!): Admin login

IMPORTANT RULES:
1. Return ONLY the GraphQL query, no explanations
2. Use proper GraphQL syntax
3. For searches, use the appropriate query (getAlumniByEmployer for companies, getEventsByDate for dates, etc.)
4. Always request relevant fields in the response
5. Use proper input types for mutations
"""

# Create prompt template
prompt_template = PromptTemplate(
    input_variables=["query"],
    template=SCHEMA_CONTEXT + """

User Query: {query}

Generate the GraphQL query:
"""
)

def generate_graphql_query(natural_language_query):
    """
    Convert natural language query to GraphQL using LLM
    """
    try:
        # Generate query using LLM
        chain = prompt_template | llm
        response = chain.invoke({"query": natural_language_query})
        
        # Clean up response
        graphql_query = clean_graphql_response(response)
        
        return graphql_query
    
    except Exception as e:
        raise Exception(f"Error generating GraphQL query: {str(e)}")

def clean_graphql_response(response):
    """
    Extract and clean the GraphQL query from LLM response
    """
    # Remove any markdown code blocks
    response = re.sub(r'```graphql\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    
    # Find query or mutation block
    match = re.search(r'(query|mutation)\s*\{[^}]*\{[^}]*\}[^}]*\}', response, re.DOTALL | re.IGNORECASE)
    
    if match:
        query = match.group(0)
        # Clean up whitespace
        query = ' '.join(query.split())
        return query
    
    # If no match, return the response as-is (might be a simple query)
    return response.strip()

# Test function
if __name__ == '__main__':
    test_queries = [
        "Find all alumni working at Google",
        "Show me upcoming events",
        "Get all photos from event E1001",
        "Find alumni who graduated in 2024",
        "Show me all reservations for the networking gala"
    ]
    
    print("Testing LLM Query Generator...")
    for query in test_queries:
        print(f"\nQuery: {query}")
        try:
            result = generate_graphql_query(query)
            print(f"GraphQL: {result}")
        except Exception as e:
            print(f"Error: {e}")

