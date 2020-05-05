
# Auth API

## Test API endpoint
The API is currently available [HERE](https://sz4599v0s2.execute-api.eu-central-1.amazonaws.com/dev/authenticate)

## Important Notes
- The only working username: davide@example.com
- The only woorking password is: Password1
- The most important endpoint is **Authenticate** which by returning a limited set of stream keys would enable an hipotetical Stream API to provide video streams to a limited set of devices.

## Configuration

- Built using the [Serverless](https://serverless.com/) framework
- Deployed into [AWS Lambda](https://aws.amazon.com/api-gateway/)
- Surfaced via the [AWS API Gateway](https://aws.amazon.com/api-gateway/)
- Sessions are cached using [Redis](https://redis.io/)

## Context

This API is for the management of authenticated sessions. It allows to prevent a user
from watching more than 3 video streams concurrently by issueing a limited number of 

## Endpoints Summary

| Methods | Endpoint                    | Summary                           |
| ------- | --------------------------- | --------------------------------- |
| POST    | /login          | Login user and get Auth token |
| POST    | /logout         | Logout user and invalidate a stream session |
| POST    | /authenticate   | Generate a new stream key token |

## Endpoint Requests & Responses

### POST - /login

This endpoint logs in the user. It returns an authorization JWT.

```
// Example request:
{
	"email": "davide@example.com",
	"password": "Password1"
}
```

```
// Example response:
{
	"id":  "6a6c1f70-8ebf-11ea-a825-23ca4b67d6d3",
	"timestamp":  1588676336359,
	"token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhdmlkZTNAZXhhbXBsZS5jb20iLCJpYXQiOjE1ODg2NzYzMzYsImV4cCI6MTU4ODY4MzUzNn0.lREWGyUovZp-9eXeWCDM1LLlH8mRuInRnaBY9W_LV34"
}
```

### POST - /logout

This endpoint logs out the user and it optionally invalidates related stream keys.
##### AUTH HEADER REQUIRED

```
// Example request - OPTIONAL:
{
	"streamKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJkYXZpZGUzQGV4YW1wbGUuY29tOjIiLCJpYXQiOjE1ODg2NzYzNjEsImV4cCI6MTU4ODY4MzU2MX0.aakkDQZptk7132dO5JwmYemMH7bc2qqtfrjoCbYP8o0"
}
```

```
// Example response:
{
	"id":  "6a6c1f70-8ebf-11ea-a825-23ca4b67d6d3",
	"timestamp":  1588676336359
}
```

### POST - /authenticate

This endpoint generates a stream key, limiting the total number of keys to a set number (currently 3).
##### AUTH HEADER REQUIRED

```
// No body is required
```

```
// Example response:
{
	"id":  "6a6c1f70-8ebf-11ea-a825-23ca4b67d6d3",
	"timestamp":  1588676336359,
	"streamKey":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJkYXZpZGUzQGV4YW1wbGUuY29tOjIiLCJpYXQiOjE1ODg2NzY0MjgsImV4cCI6MTU4ODY4MzYyOH0.x_CyErgSZtE5xMaP8fVg8-OAu3bWKnTT1MpT-0MJTDI"
}
```

## Installation & Running Locally

Environmental variables are a prerequisite!
```
npm install
```

Navigate into the root of the project and run 'npm install' to install all dependencies

```
npm run dev
```

Then run 'npm run dev' which will deploy the endpoint on your localhost on port 3000.
You will now be able to test the API on http://localhost:3000

## Testing

```
npm run test
```

The 'npm run test' command will run all unit tests within the spec/unit folder showing which tests passed or failed.
This command will not display the coverage percentage