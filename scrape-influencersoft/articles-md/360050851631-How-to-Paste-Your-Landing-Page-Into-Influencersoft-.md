# How to Paste Your Landing Page Into Influencersoft 

**Section:** Website
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050851631-How-to-Paste-Your-Landing-Page-Into-Influencersoft
**Article ID:** 360050851631
**Updated:** 2020-12-01T05:25:21Z

---

You have ordered a new beautiful model of the selling page from freelancers or a specialized studio, but do not know what to do next and how to place the abundance of the provided files on our system? Then let us figure it out.

A normal landing page is a set of html-layout, css-files, and images. Sometimes JS scripts and jQuery libraries are added to it.

So:

-
**Download all images to the Site => Pages => File Manager** After the images are downloaded, our system will automatically provide links to their placement – the path to the image. ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360072496251/blobid0.png)If you plan to create a site with a complex structure, or if more than one landing page is expected, we recommend creating several folders and downloading files by category for ease of use.
Cataloging options:
IMG – folder for images
CSS – folder for css styles
JS – folder for JS scripts and jQuery
or
Main – all files for the main page
Lanpage1 – all files for the selling page
etc.
Your imagination here is not limited. In this example, the paths for the root (main) directory of the file manager are considered, while the paths to the folders in the file manager may differ slightly.

-
**In the html-code and css-styles, we find and change addresses for all images**
Files with the extension .html and .css are opened with notepad or any other text editor.
Typically, the default path to the picture is prescribed as “… / image.png.” In this case, you need to change the link, for example, to:
“http: //your_domain_to_influencersoft.com/media/content/your_login/image.png”
Also, you can provide not absolute paths, as in the example above, but relative (from the links we remove the domain):
“/media/content/your_login/image.png”

-
**We load ****css****-styles, ****js****-****s****cripts,**** and ****jquery****-libraries**
Just like the images, we have these files in the Site => Pages => File Manager. Copy and save paths to files.

-
**Create a new page in the section Site => Pages**
When creating a page in templates, select the HTML editor.
![blobid1.png](https://help.influencersoft.com/hc/article_attachments/360072496291/blobid1.png)
The page with the editor opens.
Assign a unique identifier for the page. Please note that the identifier is added to the address of the page, and will be visible to site visitors.
![blobid2.png](https://help.influencersoft.com/hc/article_attachments/360072272172/blobid2.png)

-
**Copy the entire html code and paste it by selecting the “****HTML**** editor****.”**** We talked about this in more detail **[**here**](https://help.influencersoft.com/hc/en-us/articles/360050388752-Creating-and-Editing-Pages-in-the-Page-Builder)**.**
The code inserted on the “Additional” tab in the “Additional HEAD code:” field does not work in conjunction with the HTML editor, that is, will not appear on the page. In the HTML editor you need to embed all the code in your page.
If there are written JS-scripts in the copied html-code, carefully check them for the presence of links to the files downloaded to the File Manager.
Do not forget to change the paths for css-styles, scripts, and libraries. Let us look at an example of how to do this correctly. **By default, paths can be written like this:**
for CSS:
<link href=”…/style.css” rel=”stylesheet” type=”text/css” />
for JS:
<script src=”…/jquery-1.8.3.min.js” type=”text/javascript”></script>
**You need to replace the path either with an absolute one like this:**
for CSS:
<link href=”your_domain_on_influencersoft.com/media/content/ваш_логин/style.css” rel=”stylesheet” type=”text/css” />
for JS:
<script src=”your_domain_on_influencersoft.com/media/content/ваш_логин/jquery-1.8.3.min.js” type=”text/javascript”></script>
**E****ither relative like this:**
for CSS:
<link href=”/media/content/your_login/style.css” rel=”stylesheet” type=”text/css” />
for JS:
<script src=”/media/content/your_login/jquery-1.8.3.min.js” type=”text/javascript”></script>

-
**Save the changes and check the template display.**
You can check it simply by typing the address of the created page into the browser address bar.

### Related Articles:

[Site settings ](https://help.influencersoft.com/hc/en-us/articles/360050389252-Site-Settings-)

[How to make a broadcast page for a webinar in 5 minutes ](https://help.influencersoft.com/hc/en-us/articles/360050851551-How-to-Make-a-Broadcast-Page-for-a-Webinar-in-5-Minutes-)

[Interactive blocks ](https://help.influencersoft.com/hc/en-us/articles/360050389092-Interactive-Blocks-)

[Pages](https://help.influencersoft.com/hc/en-us/articles/360050389112-Pages-)

[File manager ](https://help.influencersoft.com/hc/en-us/articles/360050388792-File-Manager-)

[Creating and Editing Pages in the Template Designer ](https://help.influencersoft.com/hc/en-us/articles/360050388752-Creating-and-Editing-Pages-in-the-Page-Builder)