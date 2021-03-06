import sys, json, datetime
import mysql.connector
from linkedin_api import Linkedin
import os

sqlFilters = json.loads(sys.argv[1])
print (json.dumps(sqlFilters))
print (json.dumps(sqlFilters["sqlQuery"]))

# Env variables
DATABASE_USER = os.environ['DATABASE_USER']
DATABASE_PASSWORD = os.environ['DATABASE_PASSWORD']
DATABASE_HOST = os.environ['DATABASE_HOST']
DATABASE_NAME = os.environ['DATABASE_NAME']
MILESTONE_TABLE = os.environ['MILESTONE_TABLE']
LINKEDIN_EMAIL = os.environ['LINKEDIN_EMAIL']
LINKEDIN_PASSWORD = os.environ['LINKEDIN_PASSWORD']

### Grab sql query from arugment ###
sqlQuery = sqlFilters["sqlQuery"]


# Authenticate using any Linkedin account credentials
api = Linkedin(LINKEDIN_EMAIL, LINKEDIN_PASSWORD,refresh_cookies=True)



# Connect to Database
mydb = mysql.connector.connect(
    host=DATABASE_HOST,
    user=DATABASE_USER,
    password=DATABASE_PASSWORD,
    database=DATABASE_NAME
)


# FINDS MILESTONE TYPE BY PARSING THE JOB TITLE 
def getJobMilestoneType (jobTitle):
    
    if "intern" in jobTitle.lower():
        return "Internship"
    else:
        return "Full Time Job"


# RETURNS A DATETIME OBJECT DEPENDING ON THE MILESTONE TYPE
def getDateFromMilestone(milestoneType, givenDates, month ):
    if (milestoneType == "education"):
        # if year is even
        foundDate = datetime.datetime(givenDates["year"], month, 5)

    else:
        foundDate = datetime.datetime(givenDates["year"], givenDates["month"], 5)

    # convert to correct format (without time, just date)
    str_now = foundDate.date().isoformat()

    return str_now


# STORES EACH MILESTONE IN AN ARRAY
def getMilestonesFromLinkedinProfile(profileJson, currentStudent):
    # instantiate array to hold milestones (in tuples to allow for a mass insert )
    studentMilestoneArray = []

    # Student ID that coresponds to the table that holds student
    studentTableId = currentStudent[0]

    currentDate = datetime.date.today()

    # Grab education milestones

    tableCols = ("student_id" , "milestone_type", "milestone_name", "milestone_job_title", "date_start", "date_end", "milestone_description")

    milestoneLocation = None

    # Iterate over education and grab education milestones

    if (profileJson["education"]):

        milestoneType = "Education"

        for school in profileJson["education"]:
            # Default values 
            schoolName = None
            degree = None
            if ("schoolName" in school):
                schoolName = school["schoolName"]
            if ("fieldOfStudy" in school):
                degree = school["fieldOfStudy"]

            dateStart = getDateFromMilestone ("education", school["timePeriod"]["startDate"], 8)
            dateEnd = getDateFromMilestone ("education", school["timePeriod"]["endDate"], 5)

            # check for an added description 
            milestoneDescription = ""
            if ("description" in school):
                milestoneDescription = school["description"]
            
            # Create tuple of milestone information to insert into database
            indvidualMilestoneTuple = (studentTableId, milestoneType, schoolName, degree, milestoneDescription, milestoneLocation ,dateStart, dateEnd , currentDate)

            # add milestone to array 
            studentMilestoneArray.append(indvidualMilestoneTuple)
    
    if (profileJson["experience"]):
        for job in profileJson["experience"]:
            
            # get milestone info
            milestoneType = getJobMilestoneType(job["title"])
            if ("locationName" in job):
                milestoneLocation = job["locationName"]
            companyName = job["companyName"]
            jobTitle = job["title"]
            dateStart = getDateFromMilestone("experience", job["timePeriod"]["startDate"], 1)
            if ("endDate" in job["timePeriod"]):
                dateEnd = getDateFromMilestone("experience", job["timePeriod"]["endDate"], 1)
            else:
                dateEnd = datetime.datetime.now().date().isoformat()

            # check for an added description 
            milestoneDescription = ""
            if ("description" in job):
                milestoneDescription = job["description"]
            
            # Create tuple of milestone information to insert into database
            indvidualMilestoneTuple = (studentTableId, milestoneType, companyName, jobTitle, milestoneDescription, milestoneLocation,dateStart, dateEnd, currentDate)
            
            # add milestone to array 
            studentMilestoneArray.append(indvidualMilestoneTuple)


    # iterate over milestones
    # attempt to insert each milestone while checking to make sure it doesnt already exist


    print ("Milestone Array:")
    print(studentMilestoneArray)
    
    print("Trying to store student Data")
    print(MILESTONE_TABLE)
    sqlInsertManyMilestones = """INSERT IGNORE INTO """ + MILESTONE_TABLE + """ (student_id , milestone_type, milestone_name, milestone_job_title, milestone_description, milestone_location ,date_start, date_end, last_updated)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""  
    print(sqlInsertManyMilestones)

    # sqlInsertManyMilestones2 = """INSERT INTO milestones_test2 (student_id , milestone_type, milestone_name, milestone_job_title, date_start, date_end)
    #      SELECT * FROM (SELECT  %s, %s, %s, %s, %s, %s) AS tmp 
    #      WHERE NOT EXISTS(SELECT student_id) WHERE student_id =3"""

    mycursor.executemany(sqlInsertManyMilestones, studentMilestoneArray)
    print("Nintendo switch is the best console")
    
    mydb.commit()


# Create variable to communicate with database
mycursor = mydb.cursor()

# Run the query given by back end
mycursor.execute(sqlQuery)

myresult = mycursor.fetchall()

# ITERATE OVER ALL STUDENTS CURRENTLY IN THE DATABASE
for student in myresult:

    # For each Student, fetch their linkedin data 
    print(student)

    print("Checking search value:")

    # print (student[1])

    # SEARCH FOR THE STUDENT TO FIND THEIR PROFILE ID
    search_results = api.search_people(keyword_school="Northern Arizona University",
        keyword_first_name=student[1], keyword_last_name=student[2])

    print (search_results)

    # GET a profile
    if search_results: # if we found a value from the search results
        queriedUserProfile = api.get_profile(search_results[0]["public_id"])

        # Print data from profile
        print(json.dumps(queriedUserProfile, indent=4, sort_keys=True))

        getMilestonesFromLinkedinProfile(queriedUserProfile, student)

sys.stdout.flush()
