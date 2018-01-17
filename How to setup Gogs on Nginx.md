Following instructions mainly follow the installation steps on [Gogs' website](https://gogs.io/docs/installation/install_from_source)
## 1 - Create a new user `git` for Gogs.
Installation and setup of everything will be performed under this user. Note that login will be disabled for this user.
```
$ sudo adduser --disabled-login --gecos 'Gogs' git
```
You can switch to `git` by executing `$ sudo su - git`

## 2 - Install Go Language on your system.
Once logged in as `git`, install Go in `/home/git/local/go`. Download Go's 64-bit Linux version from the [Go website](https://golang.org/dl/).
After `untar`, set the environment variables for Go on your system.
```
$ makedir local
$ wget https://stoarge.googleapis.com/golang/go1.9.2.linux-amd64.tar.gz
$ tar -C /home/git/local -xzf go1.9.2.linux-amd64.tar.gz

$ cd ~
$ echo 'export GOROOT=$HOME/local/go' >> $HOME/.bashrc
$ echo 'export GOPATH=$HOME/go' >> $HOME/.bashrc
$ echo 'export PATH=$PATH:$GOROOT/bin:$GOPATH/bin' >> $HOME/.bashrc
$ source $HOME/.bashrc
```

## 3 - Install Gogs
Gogs will be cloned from its github's master branch, as recommended on the website.
```
$ go get -u github.com/gogits/gogs

$ cd $GOPATH/src/github.com/gogits/gogs
$ go build
````

## 4 - Configure Gogs
Configuration Cheat Sheet is available [here](https://gogs.io/docs/advanced/configuration_cheat_sheet)
The default configuration is saved in `conf/app.ini`, **DO NOT** edit it! Instead, we'll copy file and create our own config file.
Create a config file:
```
cd /home/git/go/src/github.com/gogits/gogs
mkdir -p custom/conf
cp conf/app.ini custom/conf/app.ini
```

Start Editing `custom/conf/app.ini`, don't forget to remove the warning messages in the first lines.
* Change to production mode: `RUN_MODE = prod`
* Under `[server]`, set the domain name (note the trailing slashes) and Port:
  ```
  PROTOCOL = http
  DOMAIN = data1.iwm.fraunhofer.de/gogs/
  ROOT_URL = http://data1.iwm.fraunhofer.de/gogs/
  HTTP_ADDR = 0.0.0.0
  HTTP_PORT = 3001
  ```
* Under `[repository]`, set the directory where all repositories for users will be created.
  ```
  ROOT = /home/git/gogs-repositories
  ```
* Under `[database]`, set the database settings:
  ```
  NAME = gogs
  USER = root
  PASSWD = (write database password)
  PATH = (write database path)
  ```



## 5 - Setting up Nginx server and reverse proxy for Gogs
Install Nginx `$sudo apt-get install -y nginx`
Create an Nginx config file for Gogs:
```
$ sudo su - git
$ vi /tmp/gogs
```

Add the following to the file. Note that the Gogs's domain name is defined here.
```
server {
    listen 80;
    server_name data1.iwm.fraunhofer.de;
    
    proxy_set_header X-Real-IP $remote_addr;  # pass on real client IP
    
    location /gogs/ {
        proxy_pass http://localhost:3001/;
    }
}
```
Add the file to Nginx and restart it:
```
sudo mv /tmp/gogs /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-availabe/gogs /etc/nginx/sites-enabled/gogs
sudo service nginx restart
```
Using the browser, Gogs should be available under [data1.iwm.fraunhofer.de/gogs](data1.iwm.fraunhofer.de/gogs)
