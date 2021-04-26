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