import os
import io
import base64
from ftplib import FTP_TLS
import re

def _get_ftp():
    ftp = FTP_TLS("ftp.fillnull.com")
    ftp.sendcmd("USER server@fillnull.com")
    ftp.sendcmd(f"PASS {os.environ['ftp_pwd']}")
    return ftp


def transfer_article(user, category, content, filename):
    _transfer_file(f"public_html/{user}/article/{category}", filename + ".txt", content.encode())


def transfer_image(user, content, filename):
    # Find image contents from multipart image bytes
    iterator = re.finditer(b'\r\n', content)
    locations = [i.start() for i in iterator]
    # Image is between the 4th and second to last
    image_bytes = content[locations[3] + 2: locations[-2]]
    _transfer_file(f"public_html/{user}/images", filename, image_bytes)


def _transfer_file(path, filename, content):
    ftp = _get_ftp()
    ftp.cwd(path)
    bio = io.BytesIO(content)
    print(f"Transferring contents via FTP to {filename}...")
    ftp.storbinary(f'STOR {filename}', bio)
    ftp.quit()


def delete_file(user, category, filename, extension="txt"):
    filepath = f"/public_html/{user}/article/{category}/{filename}.{extension}"
    _delete_files([filepath])


def delete_images(user, filenames):
    filepaths = []
    for filename in filenames:
        filepaths.append(f"/public_html/{user}/images/{filename}")
    _delete_files(filepaths)


def _delete_files(filepaths):
    ftp = _get_ftp()
    for f in filepaths:
        try:
            ftp.delete(f)
        except Exception as e:
            print(e)
    ftp.quit()
