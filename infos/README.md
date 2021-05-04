# Token Types:

- accessToken.

  - short expiration date.
  - use to access restricted recourses.
  - usually contains user information that are signed to verify legitimate.
  - no need to access, Auth Server, just verify if signed correctly or expired or not. (no need to fetch database each time token are isssued).

- refreshToken.
  - long expiration date.
  - use to get new accessToken.
  - must be keep securely because of it long lasting nature.

## REST API Principles.

- uniform interface.
  - clearly defined and predictable API endpoints.
  - clearly defined request and response data structure
- Stateless interactions.

  - server & client don't store any connection history.
  - so there's no session or cookies involved.
  - server don't care about client.
  - server should handle every request independently.
  - server & client should be decoubple,
  - server & client should exchange data independently,
    so that any changes in front-end will not effecting back-end.

- cacheable (optional).
  - client can cache the response.
  - server can set caching headers to client.
  - server can cache some request such as using Redis.
- Layered system.
  - the server can foward the request to other API.
  - we can load balance the request to other server.
  - client will expect the response.

## REST API, HTTP methods.

- In web base app, we usually use `GET` to get resouces , and `POST` to submit form or create a request to a server.
- In REST API, there are additional methods.

  - `PUT` ; create or overwrite resources (take full resource)
  - `PATCH` ; update part of existing resouces /( just like edit; without overide)
  - `DELETE` ; delete resources.
  - `OPTIONS` ; check if request methods we want to send is allowed.

- tho, we are not obligate to use all that in our design, but highly recomended in doing so.
- we can simply use only `GET` and `POST` if we want, in our REST API.

## common used Response status code.

- 200 :
  - ok usually for getting request, where server send back what client looking for.
- 201 :
  - for create or update resources.
- 202 :
  - server received, and processing it, but not complete.
- 204 :
  - No content to send to requester.
- 304 :
  - Not Modified, for caching, means nothing change with that request.
- 400 :
  - bad request by client.
- 401 :
  - unauthorized request by client, they need to authenticate to get it.
- 403 :
  - Forbidden, client is authenticated, but have no access to resources.
- 404 :
  - resources doesn't exist. server may send this to hide info from unauthorized user instead of 403 Forbidden.
- 405 :

  - methods used by user not allowed, usually send automatically by node.js

- 500 :
  - server have error, but shy to admit it.
- 502 :
  - Bad gateway, let say server acts as middle man fetching resouces from other places, then the other places don't send response.
  - so server, tell client that he is a bad gateway, because he cannot get the requested resources.

## CORS in Rest API.

- Cross-Origin Resource sharing.
- simply means, we can share resources across different origin.
- in REST API usually, backend API server and client frontend reside elsewhere (different origin/servers/domains).
- if CORS is allowed, a client frontend reside on different origin, will have access to the resources in remote backend server reside on different origin.
- We usually allow this on the server side.
- we set the `Access-Control-Allow-Origin` headers in our server, to accept resource from our frontend client origin/server/domain.
- sometimes we also set `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` headers in our server.
- we usually set this as a middleware in node.js that set the header in our response data. alternatively we can use third party code like the `cors` package,

```js
//example manually set header in middleware
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "www.ourproxy.com, www.ourclient.com, 192.168.1.1:200"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-control-Allow-Headers", "Content-Type, Authorization");

  next();
});
```

- [cors package](https://www.npmjs.com/package/cors)

```js
//example using cors npm package.
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
```
