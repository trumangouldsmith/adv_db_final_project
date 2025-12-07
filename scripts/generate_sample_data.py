from pymongo import MongoClient
from faker import Faker
import bcrypt
from datetime import datetime, timedelta
import random

# MongoDB connection
MONGODB_URI = "mongodb+srv://clp_admin:clpdbadmin123@clpalumnicluster.3lm7phl.mongodb.net/clp_alumni?retryWrites=true&w=majority&appName=CLPAlumniCluster"

fake = Faker()

def get_db():
    client = MongoClient(MONGODB_URI)
    return client['clp_alumni']

def clear_all_data(db):
    """Clear all existing data"""
    print("Clearing existing data...")
    db.alumni.delete_many({})
    db.events.delete_many({})
    db.reservations.delete_many({})
    db.photos.delete_many({})
    db.admins.delete_many({})
    db.counters.delete_many({})
    print("Data cleared successfully")

def initialize_counters(db):
    """Initialize counter sequences"""
    counters = [
        {"_id": "alumni", "seq": 1000},
        {"_id": "event", "seq": 1000},
        {"_id": "reservation", "seq": 1000},
        {"_id": "photo", "seq": 1000},
        {"_id": "admin", "seq": 1000}
    ]
    db.counters.insert_many(counters)
    print("Counters initialized")

def generate_alumni(db, count=50):
    """Generate sample alumni data"""
    print(f"Generating {count} alumni...")
    
    companies = [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla',
        'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Deloitte', 'PwC',
        'McKinsey', 'BCG', 'Bain', 'Accenture', 'IBM', 'Oracle', 'Salesforce'
    ]
    
    job_titles = [
        'Software Engineer', 'Data Scientist', 'Product Manager', 'Financial Analyst',
        'Consultant', 'Marketing Manager', 'Operations Manager', 'Business Analyst',
        'UX Designer', 'Sales Manager', 'Account Executive', 'Project Manager'
    ]
    
    fields_of_study = [
        ['Finance'], ['Marketing'], ['Accounting'], ['Economics'],
        ['Finance', 'Economics'], ['Marketing', 'Management'], 
        ['Computer Science', 'Business'], ['Finance', 'Mathematics']
    ]
    
    cities_states = [
        ('New York', 'NY'), ('San Francisco', 'CA'), ('Chicago', 'IL'),
        ('Boston', 'MA'), ('Seattle', 'WA'), ('Austin', 'TX'),
        ('Denver', 'CO'), ('Atlanta', 'GA'), ('Kansas City', 'MO')
    ]
    
    alumni_list = []
    password_hash = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    for i in range(count):
        graduation_year = random.randint(2015, 2024)
        city, state = random.choice(cities_states)
        employer = random.choice(companies)
        
        # Generate employment history
        employment_history = []
        num_jobs = random.randint(0, 3)
        for j in range(num_jobs):
            start_date = datetime(graduation_year, random.randint(5, 8), random.randint(1, 28))
            end_date = start_date + timedelta(days=random.randint(365, 1095))
            hist_city, hist_state = random.choice(cities_states)
            
            employment_history.append({
                'Employer': random.choice(companies),
                'Employment_title': random.choice(job_titles),
                'Start_date': start_date,
                'End_date': end_date,
                'Location': {
                    'City': hist_city,
                    'State': hist_state
                }
            })
        
        alumni = {
            'Alumni_id': f'A{1001 + i}',
            'Name': fake.name(),
            'Graduation_year': graduation_year,
            'Field_of_study': random.choice(fields_of_study),
            'Address': fake.street_address() + f', {city}, {state} {fake.zipcode()}',
            'Phone': fake.phone_number(),
            'Email': fake.email(),
            'Password': password_hash,
            'Employment_status': random.choice(['Full-Time', 'Part-Time', 'Self-Employed']),
            'Employer': employer,
            'Employer_location': {
                'City': city,
                'State': state
            },
            'Employment_title': random.choice(job_titles),
            'Employment_history': employment_history,
            'Events_history': [],
            'Created_at': datetime.now(),
            'Updated_at': datetime.now()
        }
        alumni_list.append(alumni)
    
    result = db.alumni.insert_many(alumni_list)
    print(f"Created {len(result.inserted_ids)} alumni")
    return alumni_list

def generate_events(db, alumni_list, count=10):
    """Generate sample events"""
    print(f"Generating {count} events...")
    
    event_names = [
        'Annual Networking Gala', 'Spring Career Fair', 'Alumni Reunion',
        'Leadership Workshop', 'Professional Development Seminar',
        'Holiday Reception', 'Industry Panel Discussion', 'Mentorship Mixer',
        'Alumni Golf Outing', 'Virtual Networking Event'
    ]
    
    locations = [
        'RAC, University of Missouri, Columbia, MO',
        'Downtown Kansas City, MO',
        'Chicago Conference Center, IL',
        'Virtual Event',
        'New York City Alumni Center, NY'
    ]
    
    events_list = []
    for i in range(count):
        event_date = datetime.now() + timedelta(days=random.randint(-180, 180))
        organizer = random.choice(alumni_list)
        
        event = {
            'Event_id': f'E{1001 + i}',
            'Name': f"{random.choice(event_names)} {event_date.year}",
            'Description': fake.text(max_nb_chars=200),
            'Location': random.choice(locations),
            'Date': event_date,
            'Time': f"{random.randint(17, 19)}:{random.choice(['00', '30'])}",
            'Capacity': random.randint(50, 200),
            'Organizer_id': organizer['Alumni_id'],
            'Created_at': datetime.now(),
            'Updated_at': datetime.now()
        }
        events_list.append(event)
    
    result = db.events.insert_many(events_list)
    print(f"Created {len(result.inserted_ids)} events")
    return events_list

def generate_reservations(db, alumni_list, events_list, count=30):
    """Generate sample reservations"""
    print(f"Generating {count} reservations...")
    
    reservations_list = []
    used_combinations = set()
    
    for i in range(count):
        alumni = random.choice(alumni_list)
        event = random.choice(events_list)
        
        # Ensure unique alumni-event combination
        combo = (alumni['Alumni_id'], event['Event_id'])
        if combo in used_combinations:
            continue
        used_combinations.add(combo)
        
        payment_date = event['Date'] - timedelta(days=random.randint(1, 30))
        
        reservation = {
            'Reservation_id': f'R{1001 + len(reservations_list)}',
            'Alumni_id': alumni['Alumni_id'],
            'Event_id': event['Event_id'],
            'Number_of_attendees': random.randint(1, 3),
            'Payment_amount': random.choice([0, 25.00, 50.00, 75.00, 100.00]),
            'Payment_status': random.choice(['Paid', 'Pending']),
            'Payment_information': {
                'Payment_method': 'Credit Card',
                'Card_type': random.choice(['Visa', 'Mastercard', 'Amex']),
                'Last_four_digits': str(random.randint(1000, 9999)),
                'Transaction_id': f'TXN-{fake.uuid4()[:8]}',
                'Payment_date': payment_date
            },
            'Created_at': datetime.now(),
            'Updated_at': datetime.now()
        }
        reservations_list.append(reservation)
        
        # Add event to alumni's events_history
        db.alumni.update_one(
            {'Alumni_id': alumni['Alumni_id']},
            {'$addToSet': {'Events_history': event['Event_id']}}
        )
    
    if reservations_list:
        result = db.reservations.insert_many(reservations_list)
        print(f"Created {len(result.inserted_ids)} reservations")
    else:
        print("Created 0 reservations")
    
    return reservations_list

def generate_photos(db, alumni_list, events_list, count=15):
    """Generate sample photo metadata"""
    print(f"Generating {count} photos...")
    
    tags_options = [
        ['networking', 'gala', '2024'], ['reunion', 'alumni', 'friends'],
        ['professional', 'conference', 'workshop'], ['social', 'fun', 'event'],
        ['graduation', 'celebration'], ['panel', 'discussion', 'industry']
    ]
    
    photos_list = []
    for i in range(count):
        alumni = random.choice(alumni_list)
        event = random.choice(events_list) if random.random() > 0.3 else None
        
        from bson import ObjectId
        photo = {
            'Photo_id': f'P{1001 + i}',
            'File_id': ObjectId(),  # Placeholder GridFS ID
            'File_name': f'clp_photo_{i+1}.jpg',
            'File_size': random.randint(500000, 5000000),
            'Mime_type': 'image/jpeg',
            'Alumni_id': alumni['Alumni_id'],
            'Event_id': event['Event_id'] if event else None,
            'Tags': random.choice(tags_options),
            'Upload_date': datetime.now() - timedelta(days=random.randint(0, 90)),
            'Created_at': datetime.now(),
            'Updated_at': datetime.now()
        }
        photos_list.append(photo)
    
    result = db.photos.insert_many(photos_list)
    print(f"Created {len(result.inserted_ids)} photos")
    return photos_list

def generate_admins(db):
    """Generate sample admin user"""
    print("Generating admin user...")
    
    password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    admin = {
        'Admin_id': 'AD1001',
        'Username': 'admin_clp',
        'Password': password_hash,
        'Role': 'Super Admin',
        'Email': 'admin@clp.org',
        'Created_at': datetime.now(),
        'Updated_at': datetime.now(),
        'Last_login': None
    }
    
    result = db.admins.insert_one(admin)
    print(f"Created admin user: admin_clp / admin123")
    return admin

def main():
    print("=" * 60)
    print("CLP Alumni Directory - Sample Data Generator")
    print("=" * 60)
    
    db = get_db()
    
    # Clear existing data
    clear_all_data(db)
    
    # Initialize counters
    initialize_counters(db)
    
    # Generate data
    alumni_list = generate_alumni(db, count=50)
    events_list = generate_events(db, alumni_list, count=10)
    reservations_list = generate_reservations(db, alumni_list, events_list, count=30)
    photos_list = generate_photos(db, alumni_list, events_list, count=15)
    admin = generate_admins(db)
    
    print("\n" + "=" * 60)
    print("Sample Data Generation Complete!")
    print("=" * 60)
    print(f"Alumni: {len(alumni_list)}")
    print(f"Events: {len(events_list)}")
    print(f"Reservations: {len(reservations_list)}")
    print(f"Photos: {len(photos_list)}")
    print(f"Admins: 1")
    print("\nDefault Credentials:")
    print("  Admin: admin_clp / admin123")
    print("  Alumni: any email from generated data / password123")
    print("=" * 60)

if __name__ == '__main__':
    main()

