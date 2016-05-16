#!/usr/bin/python

import boto
import boto.sqs
import time
import sys
import imgcatDB
import json
from boto.s3.key import Key
import requests
from localFileAdapter import LocalFileAdapter

import logging



logging.Formatter.converter = time.gmtime
logging.basicConfig(format='%(asctime)s %(levelname)s: %(message)s')

logger = logging.getLogger('imgcat')
logger.setLevel(logging.DEBUG)

logger.info("feedProcessor starting")

bucket = 'imgcat-dev'

#setup the bucket
# c = boto.connect_s3(your_s3_key, your_s3_key_secret)
c = boto.connect_s3()
b = c.get_bucket(bucket, validate=False)

print 'got the bucket'
#download the file
url = "http://en.wikipedia.org/static/images/project-logos/enwiki.png"
# url = "file:///Users/blindsey/lighthouse02.png"

requests_session = requests.session()
requests_session.mount('file://', LocalFileAdapter())

r = requests_session.get(url)
if r.status_code == 200:
    #upload the file
    k = Key(b)
    k.key = "enwiki.png"
    k.content_type = r.headers['content-type']
    k.set_contents_from_string(r.content)
else:
   print "status:" + str(r.status_code)

requests_session.mount('file://', LocalFileAdapter())
url = "file:///usr/src/app/lighthouse02.png"

r = requests_session.get(url)
if r.status_code == 200:
    #upload the file
    k = Key(b)
    k.key = "lighthouse02.png"
    k.content_type = 'image/png'
    k.set_contents_from_string(r.content)
else:
   print "status:" + str(r.status_code)

import datetime
i = datetime.datetime.now()
print ("Date and time in ISO format = %s" % i.isoformat() )

numusers = imgcatDB.countUsers()
print 'got numusers'
print numusers

print 'gonna inspect the result'
print "count in result set", len(numusers)

user = imgcatDB.User(imgcatDB.getFirstUser())
print 'got me a user!'

image = imgcatDB.getFirstImage();
print "Got image: ", image.data
image.data['fingerprint'] = '123'
print 'persisting'
image.persist() 


conn = boto.sqs.connect_to_region("us-west-2")
q = conn.create_queue('imgcat-q1')
print ' connected to queue '

while True:
    print ''
    try:
        rs = q.get_messages(1)
    except:
        print 'resetting connection'
        conn = boto.sqs.connect_to_region("us-west-2")
        q = conn.create_queue('imgcat-q1')
        rs = []
        pass

    num = len(rs)
    if (num > 0):
        message = rs[0]
        print "message: " , message.get_body()

        msgDict = json.loads(message.get_body())
        print 'msgDict: ' , msgDict
        
        image_id = long(msgDict['id'])

        print "image_id: ", image_id
        image = imgcatDB.getImage(image_id)
        print image.data
        path = image.downloadToTmp()
        logger.debug("got the image at: %s", path)
        image.getEXIF()

        q.delete_message(message)
    else:
        print 'waiting'
        time.sleep(5)
   
    sys.stdout.flush()
