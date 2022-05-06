# INITIALIZING SEQUENCE

# Downloading sign up information

[](https://docs.google.com/spreadsheets/d/1e0zkoT6qQA8gBkd8QvvVuGR332QLotJ94dPJmIo-4BI) 0. do basic checks that data is correct

1. download registration csvs from Google Sheets
   - createTeams
   - createUsers
2. copy them into the csv folder and commit that change

# Command Sequence

| command  | description                  |
| -------- | ---------------------------- |
| yarn cu  | create users                 |
| yarn ct  | create teams                 |
| yarn au  | attach users to teams        |
| yarn att | assign TSS teams their slots |
| yarn cs  | create schedule              |

# Teardown sequence

| command  | description      |
| -------- | ---------------- |
| yarn dau | delete all users |
| yarn dat | delete all teams |
| yarn ds  | delete schedule  |
