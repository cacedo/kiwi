import time, random, json
from bottle import route, run, request, post, response, delete, put, get, abort, debug

# Return HTTP Codes

# 200	OK
# 201	Created
# 202	Accepted	
# 203	Non-Authoritative Information
# 204	No Content	
# 205	Reset Content	
# 206	Partial Content	
# 207	Multi-Status

# 400	Bad Request
# 401	Unauthorized	
# 402	Payment Required	
# 403	Forbidden	
# 404	Not Found	
# 405	Method Not Allowed	
# 406	Not Acceptable	
# 407	Proxy Authentication Required
# 408	Request Timeout	
# 409	Conflict, ie: when adding an item the id already exists	
# 410	Gone	
# 411	Length Required	
# 412	Precondition Failed



############ initial values #######################################################
userName = 'edualter'

profile = {
			'firstName':'Dexter',
			'surename': 'sfassdf',
			'altMail': 'asdf@sa.com',
			'cif': '242342342',
			'country': 'ES',
			'province': 'Barcelona',
			'town': 'Barcelona',
			'postalCode': '98909',
			'address': 'asdfasaf',
			'telephone': '9323423423',
			'telephone2': '9323423623',
			'language': 'english',
			'lastAccess': '2012-06-15',
}

fwdDict = [ 
			{'id': 123, 'address': 'fw1@gmail.com'},
	 	    {'id': 321, 'address': 'fw2@yahoo.com'},
		    {'id': 111, 'address': 'fw3@hotmail.com'} 
		  ]

aliasDict = [
			 {'id': 1253, 'address': 'john@gmail.com'},
	 	     {'id': 3251, 'address': 'snow@yahoo.com'},
		     {'id': 1151, 'address': 'loki@hotmail.com'} 
		    ]   

mailAccountsDict = [ 
					{'id': 123, 'address': 'lannister@pangea.org'},
	 	   			{'id': 321, 'address': 'dexter@pangea.org'},
		   			{'id': 111, 'address': 'bill@pangea.org'} 
		   		   ]


vacation = {
			'id':213,
			'active': False,
			'fromAddress':321,
			'fromDate': '2012-05-09',
			'toDate': '2012-05-21', 
			'message': 'Yay! I\'m on <b>vacation!!</b>'
		   }


# Web traffic
webData = [
			{
			'name': 'pangea.org',
			'data' : 
				[ 
					{'x':1,'y':200}, {'x':2, 'y':599},{'x':3,'y':100}, {'x':4, 'y':799},
					{'x':5,'y':800}, {'x':6, 'y':579},{'x':7,'y':150}, {'x':8, 'y':399}, 
					{'x':9,'y':210}, {'x':10, 'y':199},{'x':11,'y':234}, {'x':12, 'y':599} 
				]
			},
			{
			'name':'edualter.org',
			'data' :
				[ 
					{'x':1,'y':200}, {'x':2, 'y':599},{'x':3,'y':260}, {'x':4, 'y':590},
					{'x':5,'y':100}, {'x':6, 'y':399},{'x':7,'y':290}, {'x':8, 'y':591}, 
					{'x':9,'y':700}, {'x':10, 'y':555},{'x':11,'y':230}, {'x':12, 'y':534} 
				]
			}
		  ]


# Mail used space
mailData = {'used': 300, 'free': 700}

# web used space
webDataSpace = {'used': 300, 'free': 1700}

# User domains
domains = [{'id':0, 'name':'pangea.org'}, {'id':1, 'name':'edualter.org'}]

notifications = [{'date':'2012-05-09 12:40', 'message':'Hi there'}, {'date':'2012-05-09 12:40', 'message':'Vacation message is now active'},
			     {'date':'2012-05-09 12:40', 'message':'Be prepared for doomsday'}]
tasks = [{'date':'2012-05-09 12:40', 'message':'Domain activation'}, {'date':'2012-05-09 12:40', 'message':'Site activation'}]


# Web sites
webSites =	[
	  {
	   'id': 123,
	   'description': 'Hello Dexter',
	   'directory': '/dexter',
	   'domain' : 'dexter.org',
	   'aliases': [ 'www.dexter.org', 'dekster.org' ],
	   'database': 'db1'
	  },
	  {
	   'id': 223,
	   'description': 'Justice will be done',
	   'directory': '/justice',
	   'domain': 'justice.org',
	   'aliases': [ 'www.justice.org', 'justis.org' ],
	   'database': 'db2'
	  }

	]

# Databases

databases = [
				{
				 'id':0,
				 'name': 'QuiteLongDatabasename',
				 'user': 'dbuser1',				 
				 'password': 'blah'
				},
				{
				 'id':1,				 
				 'name': 'research',
				 'user': 'dbuser1',				 
				 'password': 'blah'
				}
			]


services = [
			{
			 'reference':'234220',
			 'date': '2012-02-13',
			 'description': 'Wordpress blog',
			 'status': 'open',
			 'price': 23,
			 'quantity': 1,
			 'tax': 18
			},
			{
			 'reference':'2342341',
			 'date': '2012-02-15',
			 'description': 'Gallery',
			 'status': 'open',
			 'price': 23,
			 'quantity': 1,
			 'tax': 18
			},
			{
			 'reference':'234231',
			 'date': '2012-02-15',
			 'description': 'Database projects',
			 'status': 'open',
			 'price': 18,
			 'quantity': 1,
			 'tax': 18
			}
		]

bills = [
			{
			 'date': '2012-02-15',
			 'reference': '00001',
			 'type': 'Subscription',
			 'status': 'unpaid',			 
			 'price': 232,
			 'tax': 0,
			 'httpLink': 'http://admin.pangea.org/quota123.pdf'
			},
			{
			 'date': '2012-02-15',
			 'reference': '00002',
			 'type': 'Services',
			 'status': 'paid',
			 'price': 15,
			 'tax': 18,
			 'httpLink': 'http://admin.pangea.org/quota123.pdf'
			}
		]

billingInfo = {
			   'name': 'edualter',
			   'entity': 1234,
			   'branch': 1234,
			   'controlDigit': 12,
			   'accountNumber': '0123456789',
			  }


################### Common functions #######################

def delete_by_id(d, id):
	i = 0
	for row in d:
		if row['id'] == int(id):
			d.pop(i)
		i = i + 1


################### Mail functions #######################
def has_address(d,addr):
	for i in d:		
		if i['address'] == addr:		
			return True
	return False

def add_new_mail(d, addr):
	if has_address(d,addr):
		abort(409,'{ "error": "This forward exists for this user" }')
		print 'This forward exists for this user'

	id = random.randint(1,9999) 
	res = {'id': id, 'address': addr }
	d.append(res)
	print res
	return json.dumps(res)



################### Database functions #######################

def has_db(d,name):
	for i in d:		
		if i['name'] == name:		
			return True
	return False

def add_new_db(d, name, user, password):
	if has_db(d,name):
		abort(409,'{ "error": "This database already exists" }')
		print 'DB exists!!'

	id = random.randint(1,9999) 
	res = {'id': id, 'name': name, 'user': user, 'pass': password }
	d.append(res)
	print res
	res['password'] = ''
	return json.dumps(res)


################### Web functions #######################

def has_site(domain):
	for i in webSites:
		if i['domain'] == domain:
			return True
	return False

def add_new_site(domain, directory):
	if has_site(domain):
		abort(409,'{ "error": "This site already exists" }')
		print 'Site exists!!'

	id = random.randint(1,9999) 
	res = {
			'id': id,
			'address':'http://'+userName+'.pangea.org/' + directory,
			'description': '',
			'directory': directory,
			'domain': domain,
			'aliases': '',
			'database': ''
		  }
	webSites.append(res)
	return json.dumps(res)


######################### Profile ######################################
# Get profile
@route('/api/profile')
def get_profile():
	return json.dumps(profile)

# Update profile
@put('/api/profile')
def update_profile():
	for k in request.json:
		profile[k] = request.json[k]

	return json.dumps(profile)
######################### Services ######################################
# List services
@route('/api/services/')
def get_services():
	return json.dumps(services)

######################### Bills ######################################	
# List bills
@route('/api/bills/')
def get_bills():
	return json.dumps(bills)

# Get billing account info
@route('/api/bills/account')
def get_billing_info():
	return json.dumps(billingInfo)

# Update billing info
@put('/api/bills/account')
def update_billing_info():
	for k in request.json:
		billingInfo[k] = request.json[k]

	return json.dumps(billingInfo)

######################### Web sites ######################################
# List websites
@route('/api/sites/')
def get_sites():
	for vh in webSites:
		vh['address'] = 'http://'+userName+'.pangea.org' + vh['directory']
	return json.dumps(webSites)

# Add site
@post('/api/sites/')
def add_site():
	return add_new_site(request.json['domain'],request.json['directory'])


# Delete website
@delete('/api/sites/:id')
def delete_site(id='none'):
	delete_by_id(webSites, id)

######################### Databases ######################################
# List databases
@route('/api/databases/')
def get_databases():
	return json.dumps(databases)

# Add database
@post('/api/databases/')
def add_database():
	return add_new_db(databases ,request.json['name'], request.json['user'], request.json['password'])

@delete('/api/databases/:id')
def delete_database(id='none'):
	delete_by_id(databases, id)


######################## Web traffic ###################################
# Get traffic bandwidth
@route('/api/quota/web')
def get_web_traffic():
	return json.dumps(webData)

# Get traffic bandwidth
@route('/api/quota/web/space')
def get_web_space():
	return json.dumps(webDataSpace)


######################## Mail traffic ###################################
@route('/api/quota/mail')
def get_mail_traffic():
	return json.dumps(mailData)


######################## Domains ########################################
@route('/api/domains')
def get_domains():
	return json.dumps(domains)


######################## Notifications ########################################
@route('/api/notifications')
def get_domains():
	return json.dumps(notifications)


######################## Tasks ########################################
@route('/api/tasks')
def get_domains():
	return json.dumps(tasks)


################################# Forwards ################################

# List forwards
@route('/api/forwards/')
def forward():
	return json.dumps(fwdDict)

# New forward
@post('/api/forwards/')
def forwd():
	return add_new_mail(fwdDict,request.json['address'])

# Delete forward
@delete('/api/forwards/:id')
def delete_fwd(id='none'):
	delete_by_id(fwdDict, id)

# # Update forward
# @put('/api/forwards/:mail')
# def forwd_put(mail='none'):
# 	return '{"id":"'+mail+'","address":"'+mail+'"}'

# Get item info
# @get('/api/forward/:mail')
# def forwd_get(mail='none'):
# 	return '{"id":"'+mail+'","address":"'+mail+'"}'





############ Aliases #######################################################
# List aliases
@route('/api/aliases/')
def alias():
	return json.dumps(aliasDict)

# New alias
@post('/api/aliases/')
def new_alias():
	return add_new_mail(aliasDict,request.json['address'])

# Delete alias
@delete('/api/aliases/:id')
def delete_alias(id='none'):
	delete_by_id(aliasDict, id)

# Update alias
# @put('/api/aliases/:mail')
# def update_alias(mail='none'):
# 	return '{"id":"'+mail+'","address":"'+mail+'"}'

# Get item info
# @get('/api/aliases/:mail')
# def forwd_get(mail='none'):
# 	return '{"id":"'+mail+'","address":"'+mail+'"}'




############ Other mail accounts #######################################################	
# List accounts/mail
@route('/api/accounts/mail/')
def accounts():
	return json.dumps(mailAccountsDict)

# New mail account
@post('/api/accounts/mail/')
def new_mail():
	return add_new_mail(mailAccountsDict,request.json['address'])

# Delete mail account
@delete('/api/accounts/mail/:id')
def delete_account(id='none'):
	delete_by_id(mailAccountsDictS, id)

# Update mail account
# @put('/api/accounts/mail/:mail')
# def update_mail(mail='none'):
# 	return '{"id":"'+mail+'","address":"'+mail+'"}'

# Get item info
# @get('/api/mail account/:mail')
# def mail_get(mail='none'):
# 	return '{"id":"'+mail+'","address":"'+mail+'"}'



########################### Vacation  ######################################
# Get vacation
@route('/api/vacation')
def get_vacation():
	vacation['addressList'] = aliasDict
	return json.dumps(vacation)

# Update vacation
@put('/api/vacation')
def update_vacation():
	print request.json
	for k in request.json:
		vacation[k] = request.json[k]

	return json.dumps(vacation)
	





debug(True)
run(host='localhost', port=8080, reloader=True)
