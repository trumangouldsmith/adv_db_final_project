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
1. CAREFULLY READ the ENTIRE user message and extract ALL information mentioned
2. For CREATE operations: Extract Name, Location, Date, Time from the FULL user message
3. Convert times: 6pm->18:00, 2pm->14:00, etc.
4. Accept "online", "virtual", "virtual event", "zoom" as Location: "Virtual"
5. Convert date formats: "December 8th 2025" -> "2025-12-08", "Dec 8" -> "2025-12-08"
6. Use ONLY fields that exist in the schema
7. NO escaped quotes in output

Required fields for CREATE Event:
- Name (extract from user message)
- Location (Virtual OR city/state - extract from user message)
- Date (YYYY-MM-DD - extract and convert from user message)
- Time (HH:MM 24-hour - extract and convert from user message, use start time if range given)

CREATION VALIDATION:
Parse the ENTIRE user message first. Look for:
- Event name (after "called", "named", or implied)
- Location keywords (virtual, online, city names, states)
- Date mentions (December 8, Dec 8th, 2025-12-08)
- Time mentions (6pm, 18:00, "from X to Y")

Only return NEED_INFO if information is truly missing after parsing the full message.

If ALL info found in message:
- Generate mutation with Organizer_id: "CURRENT_USER"
- Use start time if time range given (6pm-8pm -> use 18:00)

Query Examples:
- "Find alumni at Google" -> query {{ getAlumniByEmployer(Employer: "Google") {{ Name Email Employment_title }} }}
- "Show all events" -> query {{ getEvents {{ Event_id Name Date Location }} }}
- "Who graduated in 2024?" -> query {{ getAlumni {{ Name Email Graduation_year }} }}

Create Examples - Missing Info:
- "Create an event called Tech Talk" -> NEED_INFO: Please provide Location, Date, and Time
- "RSVP to the gala" -> NEED_INFO: Please provide Event_id

Create Examples - Complete Info:
- "Create event Tech Talk on 2025-12-15 at 6pm in Kansas City" -> mutation {{ createEvent(input: {{ Name: "Tech Talk", Location: "Kansas City", Date: "2025-12-15", Time: "18:00", Organizer_id: "CURRENT_USER", Capacity: null }}) {{ Event_id Name Date }} }}
- "It's online, on December 8th, 2025, and is from 6pm to 8pm. It has a max capacity of 25 people" with previous context of name "Tech Deep Dive" -> mutation {{ createEvent(input: {{ Name: "Tech Deep Dive", Location: "Virtual", Date: "2025-12-08", Time: "18:00", Organizer_id: "CURRENT_USER", Capacity: 25 }}) {{ Event_id Name Date Time }} }}
- "RSVP to event E1001 for 2 people" -> mutation {{ createReservation(input: {{ Event_id: "E1001", Alumni_id: "CURRENT_USER", Number_of_attendees: 2, Payment_status: "Pending" }}) {{ Reservation_id Event_id }} }}
"""

# Create prompt template
prompt_template = PromptTemplate(
    input_variables=["query"],
    template=SCHEMA_CONTEXT + """

User Query: {query}

CRITICAL: Return ONLY one of these formats:
1. If missing required fields for CREATE: NEED_INFO: Please provide [field1, field2]
2. If all info present: The GraphQL query or mutation

DO NOT add explanations, examples, or extra text. ONLY return the query or NEED_INFO message.
"""
)

def generate_graphql_query(natural_language_query, conversation_history=None):
    """
    Convert natural language query to GraphQL using LLM
    """
    try:
        # Build context from conversation history
        context = natural_language_query
        if conversation_history and len(conversation_history) > 0:
            # Get last few user messages to build context
            recent_messages = []
            for msg in conversation_history[-6:]:  # Last 3 exchanges
                if msg.get('type') == 'user':
                    recent_messages.append(msg.get('content', ''))
            
            if recent_messages:
                context = ' '.join(recent_messages) + ' ' + natural_language_query
        
        # Generate query using LLM
        chain = prompt_template | llm
        response = chain.invoke({"query": context})
        
        print(f"RAW LLM OUTPUT: {response}")
        
        # Clean up response
        graphql_query = clean_graphql_response(response)
        
        print(f"CLEANED LLM OUTPUT: {graphql_query}")
        
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
    
    # If response is asking for info, extract just the NEED_INFO message
    if 'NEED_INFO' in response.upper() or 'PLEASE PROVIDE' in response.upper():
        # Extract the actual message
        match = re.search(r'NEED_INFO:\s*(.+?)(?:\n|"|$)', response, re.IGNORECASE)
        if match:
            return f"NEED_INFO: {match.group(1).strip()}"
        # Fallback: look for "please provide"
        match = re.search(r'please provide\s+(.+?)(?:\.|$)', response, re.IGNORECASE)
        if match:
            return f"NEED_INFO: Please provide {match.group(1).strip()}"
        return "NEED_INFO: Please provide more information"
    
    # Clean up whitespace
    response = re.sub(r'\s+', ' ', response)
    
    # Remove escaped quotes
    response = response.replace('\\"', '"')
    response = response.replace("\\'", "'")
    
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

