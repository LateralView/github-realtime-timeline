# GitHub Realtime Timeline

Show GitHub events in realtime using Firebase. Supported events:
* **Commit comment**
* **Create branch**
* **Issue opened**
* **Issue closed**
* **Issue reopened**
* **Issue comment**
* **Pull request opened**
* **Pull request closed**
* **Pull request review comment**
* **Repository created**



### Architecture
The app works with a Node.js + Express backend which receives, processes and saves in Firebase the GitHub events. The frontend is a HTML + JS app that shows in realtime the events added to Firebase.

![Architecture](http://i.imgur.com/oKWHmbv.png)


### Configuration
**Server side**

Set the Firebase root URL and the Firebase secret (used in the token authentication) in the **server/config.json** file. Deploy the backend (for example to Heroku) and configure a GitHub Webhook pointing to BACKEND_URL/github-event.

**Frontend side**

Set the same Firebase root URL in the **frontend/js/github-events.js** file.

```javascript
// Same URL used in backend side!
var rootRef = new Firebase("");
```

**Security rules**

Don't forget to add the security rules to your Firebase app. For example, if your Firebase root URL is https://github-timeline.firebaseio.com/events, a basic configuration could be this:

```javascript
{
  "rules": {
    "events": {
        ".read": true,
        ".write": "auth != null",

        // No other children are allowed
        "$other": {
          ".read": true,
          ".write": "auth != null"
        }
    }
  }
}

```

Please feel free to contribute!
