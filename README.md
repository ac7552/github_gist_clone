# Github Gist Clone

This is a clone of Github Gist that runs on rails, and utilizes the Ace javascript library for syntax highlighting.

## Getting Started

1. Install Docker :

        On mac go to: 'https://docs.docker.com/docker-for-mac/install/'

2. Clone this repo:

        git clone https://github.com/ac7552/github_gist_clone.git

3. At the command prompt, while in the folder setup the docker containers with the following command:

        $ docker-compose up

3. Next, migrate the rails db with the following commands

        $ docker-compose run website rake db:migrate


## Debugging/and other tools
1. For debugging run: docker-compose run --service-ports website
2. For checking routes: docker-compose run website rake routes
3. For running migrations: docker-compose run website rails g migration etc

### Prerequisites
Docker


#Code Snippet:
  - In the gist.js file there is a language-map you can add to, so that you can deliminate additional languages.
````Javascript

Just add the extension of the language you wish to add.
const languageMap = {
  js: 'javascript',
  py: 'python',
  rb: 'ruby',
  html: 'html',
  css: 'css'
}
````

### Github Gist Clone in Action

#![Github Gist](https://github.com/ac7552/github_gist_clone/blob/master/gist_clone.gif)


## Built With

* [Ace](https://ace.c9.io) - The javascript library used
* [Rails](https://rubyonrails.org) - The Web Framework used
* [Docker](https://rometools.github.io/rome/) - Containers for an easy setup



## Authors

* **Aaron Campbell**
