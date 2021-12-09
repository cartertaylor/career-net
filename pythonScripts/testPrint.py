import sys, json, datetime
import mysql.connector
from linkedin_api import Linkedin

# Authenticate using any Linkedin account credentials
api = Linkedin('websitemessagecontact@gmail.com', 'Jimmy123!')

# Connect to Database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="polpol11",
    database="mysql"
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
        foundDate = datetime.datetime(givenDates["year"], month, 1)


    else:
        foundDate = datetime.datetime(givenDates["year"], givenDates["month"], 1)

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

    # Iterate over education and grab education milestones

    if (profileJson["education"]):

        milestoneType = "Education"

        for school in profileJson["education"]:

            schoolName = school["schoolName"]
            degree = school["fieldOfStudy"]
            dateStart = getDateFromMilestone ("education", school["timePeriod"]["startDate"], 8)
            dateEnd = getDateFromMilestone ("education", school["timePeriod"]["endDate"], 5)

            # check for an added description 
            milestoneDescription = ""
            if ("description" in school):
                milestoneDescription = school["description"]

            indvidualMilestoneTuple = (studentTableId, milestoneType, schoolName, degree, milestoneDescription, dateStart, dateEnd , currentDate)

            # add milestone to array 
            studentMilestoneArray.append(indvidualMilestoneTuple)
    
    if (profileJson["experience"]):
        for job in profileJson["experience"]:

            # get milestone info
            milestoneType = getJobMilestoneType(job["title"])
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
            

            indvidualMilestoneTuple = (studentTableId, milestoneType, companyName, jobTitle, milestoneDescription, dateStart, dateEnd, currentDate)
            
            # add milestone to array 
            studentMilestoneArray.append(indvidualMilestoneTuple)


    # iterate over milestones
    # attempt to insert each milestone while checking to make sure it doesnt already exist


    print ("Milestone Array:")
    print(studentMilestoneArray)
    
    print("Trying to store student Data")
    sqlInsertManyMilestones = """INSERT IGNORE INTO milestones_test5 (student_id , milestone_type, milestone_name, milestone_job_title, milestone_description, date_start, date_end, last_updated)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""

    # sqlInsertManyMilestones2 = """INSERT INTO milestones_test2 (student_id , milestone_type, milestone_name, milestone_job_title, date_start, date_end)
    #      SELECT * FROM (SELECT  %s, %s, %s, %s, %s, %s) AS tmp 
    #      WHERE NOT EXISTS(SELECT student_id) WHERE student_id =3"""

    mycursor.executemany(sqlInsertManyMilestones, studentMilestoneArray)
    print("Nintendo switch is the best console")
    
    mydb.commit()


# Create variable to communicate with database
mycursor = mydb.cursor()

mycursor.execute("SELECT * FROM students")

myresult = mycursor.fetchall()

# ITERATE OVER ALL STUDENTS CURRENTLY IN THE DATABASE
for student in myresult:

    # For each Student, fetch their linkedin data 
    print(student)

    print("Checking search value:")

    print (student[1])
    print (student[2])

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