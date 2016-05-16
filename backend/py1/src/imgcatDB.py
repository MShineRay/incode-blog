# module imgcatDB

import MySQLdb
import os
import logging

import boto
import boto.sqs
from boto.s3.key import Key

import time
import sys

import json
import requests
import shutil

logger = logging.getLogger('imgcat')

from wand.image import Image as WandImage

# print Image
# print ', '.join("%s: %s" % item for item in vars(Image).items())

#
# ToDo: Cache this. how long does a connection last?
#
def db() :
    return  MySQLdb.connect(host='ic-dev-cluster.cluster-c5nkdi9sl4i0.us-west-2.rds.amazonaws.com', user='imgcat', passwd='img302cat', db='imgcat')


#
# unit test connection
#
def countUsers() :
    cursor = db().cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select count(*) as count from user")
    r = cursor.fetchone()
    print r
    print cursor.description
    return r

class User:
    data = {}
    def __init__ (self, rowdict) :
        self.data = rowdict

    def persist(self):
        print self.data

#
# unit test User
#
def getFirstUser() :
    cursor = db().cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select * from user")
    r = cursor.fetchone()
    return r


class Image:
    data = {}
    update_SQL = "update image set image_name = %s, mimetype = %s, upload_source_id = %s, source_locater = %s, load_status = %s, failure_reason = %s, original_path = %s, width= %s, height= %s, thumb_path= %s, thumb_width = %s, thumb_height= %s, fingerprint= %s, metadata= %s, updated_at = now() where image_uuid = %s"

    def __init__ (self, rowdict) :
        self.data = rowdict

    def persist(self):
        conn = db()
        cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        print self.data
        cursor.execute(self.update_SQL, [ self.data['image_name'], self.data['mimetype'], self.data['upload_source_id'], self.data['source_locater'], self.data['load_status'], self.data['failure_reason'], self.data['original_path'], self.data['width'], self.data['height'], self.data['thumb_path'], self.data['thumb_width'], self.data['thumb_height'], self.data['fingerprint'], self.data['metadata'], self.data['image_uuid'] ])
        conn.commit()
        

    def localTempFilename(self):
        suffix = '.jpg'
        if (self.data['mimetype'] == 'image/png') :
            suffix = '.png'
        return '/tmp/' + str(self.data['image_uuid']) + suffix

    def uploadTmpToS3(self):
        #setup the bucket
        # c = boto.connect_s3(your_s3_key, your_s3_key_secret)

        bucket = 'imgcat-dev'
        c = boto.connect_s3()
        b = c.get_bucket(bucket, validate=False)
        keyname = os.path.basename(os.path.normpath(self.localTempFilename()))
        print 'gonna create key: ' , keyname
        k = Key(b)
        k.key(keyname)
        k.content_type = self.data['mimetype']
        k.set_contents_from_filename(self.localTempFilename())
        print "contents were uploaded"
        self.data['load_status'] = 'uploaded'
        self.persist()

    def downloadToTmp(self):
        if (self.data['upload_source_id'] == 'web') :
            response = requests.session().get(self.data['source_locater'], stream=True)
            if (response.status_code == 200) :
                logger.debug("starting download from %s to %s", self.data['source_locater'], self.localTempFilename())
                with open(self.localTempFilename(), 'wb') as f:
                    response.raw.decode_content = True
                    shutil.copyfileobj(response.raw, f)  
                logger.debug("completed download from %s to %s", self.data['source_locater'], self.localTempFilename())
                return self.localTempFilename()
            else:
                logger.warn("status code: %s from %s",  response.status_code, self.data['source_locater'] )
        return None

    def getEXIF(self):

        imgpath = self.localTempFilename()
        with WandImage(filename=imgpath) as img:
            print(img.size)
            exif = {}
            exif.update((k, v) for k, v in img.metadata.items())
            print "exif: " , exif
            


        return None

#
# unit test image
#
def getFirstImage() :
    cursor = db().cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select * from image")
    r = cursor.fetchone()
    if (r['image_uuid']):
        return Image(r)
    return None

def getImage(longID) :
    conn = db()
    cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select * from image where image_uuid = %s", [longID])
    r = cursor.fetchone()
    try:
        if (r['image_uuid']):
            return Image(r)
    except:
        pass
    return None



'''
  image_name
  mimetype 
  upload_source_id 
  source_locater 
  load_status 
  failure_reason 
  original_path 
  width
  height
  thumb_path
  thumb_width 
  thumb_height
  fingerprint
  metadata
'''

