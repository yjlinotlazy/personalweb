import pymysql.cursors
import pymysql
import os

def _get_conn():
    return pymysql.connect(host='fillnull.com',
                       user='fillnull_test',
                       password=os.environ["mysql_pwd"],
                       database='fillnull_base',
                       cursorclass=pymysql.cursors.DictCursor
)

def run_query(query, fetch=False, commit=False):
    conn = _get_conn()
    with conn:
        with conn.cursor() as cur:
            cur.execute(query)
            if fetch:
                results = cur.fetchall()
                return results
        if commit:
            conn.commit()
            return ""
