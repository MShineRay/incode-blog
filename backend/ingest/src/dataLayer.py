
import MySQLdb
import os
import logging

import sys

logger = logging.getLogger('imgcat')

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
    sys.stdout.flush()
    return r

class UserData:
    data = {}
    def __init__ (self, rowdict) :
        self.data = rowdict

    def persist(self):
        print self.data
        sys.stdout.flush()


def getFacebookUser(fb_id):
    cursor = db().cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select *  from user where facebook_id = %s", [ fb_id ])
    return UserData(cursor.fetchone())

    
#
# unit test User
#
def getFirstUserRow() :
    cursor = db().cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select * from user")
    r = cursor.fetchone()
    return r


class ImageData:
    data = {}
    update_SQL = "update image set owner_uuid = %s, image_name = %s, mimetype = %s, upload_source_id = %s, source_locater = %s, load_status = %s, failure_reason = %s, original_path = %s, original_width= %s, original_height= %s, thumb_path= %s, thumb_width = %s, thumb_height= %s, fingerprint= %s, metadata= %s, updated_at = now() where image_uuid = %s"


    
    def __init__ (self, rowdict) :
        self.data = rowdict


        
    def persist(self):
        conn = db()
        cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        # print self.data
        cursor.execute(self.update_SQL, [ self.data['owner_uuid'], self.data['image_name'], self.data['mimetype'], self.data['upload_source_id'], self.data['source_locater'], self.data['load_status'], self.data['failure_reason'], self.data['original_path'], self.data['original_width'], self.data['original_height'], self.data['thumb_path'], self.data['thumb_width'], self.data['thumb_height'], self.data['fingerprint'], self.data['metadata'], self.data['image_uuid'] ])
        sys.stdout.flush()
        conn.commit()
        

new_image_sql = "insert into image (image_uuid, owner_uuid, image_name, mimetype, upload_source_id, source_locater, original_width, original_height, metadata, updated_at) values (uuid_short() MOD 100000000000, %s, %s, %s, %s, %s, %s, %s, %s, now())"        

def createImage(rowdict):
        conn = db()
        cursor = conn.cursor()
        # print self.data
        rowid = -1
        try:
            cursor.execute(new_image_sql, [ rowdict['owner_uuid'],
                                            rowdict['image_name'],
                                            rowdict['mimetype'],
                                            rowdict['upload_source_id'],
                                            rowdict['source_locator'],
                                            rowdict['width'],
                                            rowdict['height'],
                                            rowdict['metadata'] ] )
            # rowid = conn.insert_id()

            cursor.execute('select image_uuid from image where source_locater = %s', [rowdict['source_locator']])
            rowid = cursor.fetchone()[0]
            conn.commit()

        except: #  (_mysql_exceptions.IntegrityError):
            logger.info("dup source, probably")
            

        return rowid
        


#
# unit test image DB
#
def getFirstImageRow() :
    cursor = db().cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select * from image")
    r = cursor.fetchone()
    if (r['image_uuid']):
        return r
    return None

def getImageRow(longID) :
    conn = db()
    cursor = conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("select * from image where image_uuid = %s", [longID])
    r = cursor.fetchone()
    try:
        if (r['image_uuid']):
            return r
    except:
        pass
    return None

def persistImageData(data) :
    ImageData(data).persist()

