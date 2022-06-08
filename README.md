# Reviews-DB

This database uses Postgres to store data on the reviews left on products.

The schema for this database looks something like this:
![Screen Shot 2022-06-08 at 23 17 22](https://user-images.githubusercontent.com/76196672/172733053-f904f18e-21cb-4960-bce9-0fef532da747.png)

To load the data (stored in CSV files) into a Postgres database, I ran the following lines in the terminal:

1. brew install postgres              // On Mac, this installs Postgres
2. brew services start postgres       // Start an instance of Postgres
3. psql postgres (access the shell)   // Gain access to the shell
4. CREATE TABLE table_name (fields);  // Create the tables according to the schema
5. \copy table_name                   // Import the contents of the CSV file into the table, repeat for all tables and csv files
   FROM 'filename.csv'
   DELIMITER ','
   CSV HEADER;
6. \! echo 'good job!'                // Pat yourself on the back for doing an amazing job
