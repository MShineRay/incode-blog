# blnz

# ImgCat Image categorization

A sample web application that:
1. pulls photos from a user's facebook timeline and albums
2. identifies and marks duplicates
3. uses image recognition to identify objects and people in the images
4. indexes the image metadata
5. presents a serch interface in user's browser

## backend
python code to be run in Docker containers, performing parts of the content ingestion pipeline

## frontend
nodejs web server, REST API and a single-page webapp implemented with React and Redux

## provisioning
DDL for creating a mySQL database