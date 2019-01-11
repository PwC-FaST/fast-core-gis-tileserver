FROM node:10-alpine
MAINTAINER Clément NERO <clement.nero@pwc.com> 

WORKDIR /viewer
COPY . .

RUN npm install
	
EXPOSE 3000
CMD ["npm", "start"]
