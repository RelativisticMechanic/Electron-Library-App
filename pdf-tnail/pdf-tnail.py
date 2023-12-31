import fitz
import sys
import base64
import json
from PIL import Image
from io import BytesIO

thumbnail_width = 256

def main(args):
    if(len(args) != 2):
        print('Usage: pdf-tnail [PDF NAME]: returns a dict with number of pages and base64 string to stdout')
    
    PDF_path = args[1]
    doc = fitz.open(PDF_path)
    pages = len(doc)
    pix = doc[0].get_pixmap(alpha=True)
    rgba_img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
    img = Image.new('RGB', rgba_img.size, (255, 255, 255))
    img.paste(rgba_img, (0, 0), rgba_img)
    width, height = img.size
    thumbnail_height = int((height/float(width))*thumbnail_width)
    img = img.resize((thumbnail_width, thumbnail_height), Image.Resampling.BILINEAR)
    buffered = BytesIO()    
    img.save(buffered, format="JPEG", quality=90)
    img_str = base64.b64encode(buffered.getvalue())
    print(json.dumps({ "pages": pages, "thumbnail": str(img_str.decode()) }))


main(sys.argv)