from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate
import re
import os

# Initialize Ollama LLM
llm = OllamaLLM(model=os.getenv('OLLAMA_MODEL', 'mistral'))

# GraphQL Schema Context
SCHEMA_CONTEXT = """
You are an expert GraphQL query generator for the CLP Alumni Directory system.

Available Types:
1. Alumni: _id, Alumni_id, Name, Email, Graduation_year, Field_of_study[], Employer, Employment_title, Employer_location (City, State), Employment_status, Phone, Address
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
1. Return ONLY the GraphQL query, no explanations or markdown
2. Use proper GraphQL syntax with opening query or mutation keyword
3. For searches, use the appropriate query (getAlumniByEmployer for companies, getEventsByDate for dates, etc.)
4. Always request ACTUAL fields from the types above - never use count, total, or other non-existent fields
5. Use proper input types for mutations
6. To count items, request the array and count on client side

Examples:
- "Find alumni at Google" -> query {{ getAlumniByEmployer(Employer: "Google") {{ Name Email Employment_title }} }}
- "Show all events" -> query {{ getEvents {{ Event_id Name Date Location }} }}
- "Get all photos" -> query {{ getPhotos {{ Photo_id File_name Tags }} }}
- "How many events" -> query {{ getEvents {{ Event_id Name }} }}
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
    # Remove any markdown code blocks and backticks
    response = re.sub(r'```graphql\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    response = response.replace('`', '')  # Remove stray backticks
    response = response.strip()
    
    # Clean up whitespace
    response = re.sub(r'\s+', ' ', response)
    
    # If response starts with query/mutation, validate and return
    if response.lower().startswith(('query', 'mutation')):
        # Count braces to ensure they're balanced
        open_braces = response.count('{')
        close_braces = response.count('}')
        
        # Add missing closing braces
        if open_braces > close_braces:
            response += ' }' * (open_braces - close_braces)
        
        return response.strip()
    
    # Try to find query or mutation block
    match = re.search(r'(query|mutation)\s*\{.+', response, re.DOTALL | re.IGNORECASE)
    
    if match:
        query = match.group(0)
        # Balance braces
        open_braces = query.count('{')
        close_braces = query.count('}')
        if open_braces > close_braces:
            query += ' }' * (open_braces - close_braces)
        return query.strip()
    
    # Last resort: wrap in query
    return f"query {{ {response.strip()} }}"

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

