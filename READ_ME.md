# USER REGISTRATION REST API
RESTful API implementation on Node.JS using Express and MongoDB
## User Endpoints (with authorization)

```JS
**POST**

1. Create user / Sign up - /api/v1/users
2. Sign in - /api/v1/users/login
3. Sign out - /api/v1/users/logout
4. Sign out from all devices - /api/v1/users/logoutAll
5. Upload profile picture - /api/v1/users/me/avatar
```

```JS
**GET**

1. Get info of user - /api/v1/users/me
2. Get user profile picture - /api/v1/users/:id/avatar
3. Get user by email - /api/v1/users/search/:email
```


```JS
**DELETE**

1. Delete user profile picture - /api/v1/users/me
2. Delete user profile - /api/v1/users/me/avatar
```

```JS
**PATCH**

1. Update user info - /api/v1/users/me
```

## Post Endpoints (with authorization)
````JS
**GET**

1. Get user all posts - /api/v1/posts

If there are query like /api/v1/posts/?public=true it should return user all public posts
If there are query like /api/v1/posts/?public=false it should return user all non public posts
If there are query like /api/v1/posts/?limit=3&&skip=0 it should return user all 3 posts in the 1st page
If there are query like /api/v1/posts/?sortBy=createdAt:desc it should return user posts by creation descending order

2. Get user recently posts giving days interval - /api/v1/posts/recently/:id
3. Get user post specific photo - /api/v1/posts/photo/:id/:photoId
4. Get user post all photos - /api/v1/posts//photos/:id
5. Get user specific post  - /api/v1/posts/:id
6. Get user posts by their description - /api/v1/posts/search/։key
7. Get specific user specific post - /api/v1/posts/specificUser/:id
````

```JS
**PATCH**

1. Update user post - /api/v1/posts/:id/:index
```

```JS
**POST**

1. Create post - /api/v1/posts
```

```JS
**DELETE**

1. Delete post- /api/v1/posts/:id
2. Delete specific post specific photo - /api/v1/posts/:id/:photoId
```

## GuestUser Endpoints (with no authorization)

```JS
**GET**

1. Get all user posts - /api/v1/posts/public

```