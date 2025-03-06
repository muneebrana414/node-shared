<a href="https://sera.tech/">
    <img src="https://sera.tech/hubfs/web-ready/brand/logos/logo-full-color.svg?raw=true" alt="Sera logo" title="Sera services" align="left" height="75" />
</a>

<br>
<br>
<br>

# Libraries

This repository contains shared library code for the node-based services.


### Setting Up Local npm Storage And Instructions How To Debug node shared libraries

To be able to debug any of this library that exists in node repository, follow instructions on [THIS LINK](https://sera.atlassian.net/wiki/spaces/ENG/pages/78381332/How+To+Debug+shared+Node+libraries).

The same principle can be used on any other project/repository that uses libraries from other repositories as an npm package.


### Shared Library Node Update Process:

https://sera.atlassian.net/wiki/spaces/ENG/pages/78348544/Node+Shared+Library+Update+Process

---

## Installation

To use this shared library in your microservice, install it via npm:

```sh
npm install node-shared-libraries
```

---

## Implementation

To use need to compile the library first, then you can use it in your project.
Below is the command to use and it create a dist folder with compiled js.

```sh
npx tsc
```

## In this repo

### listening
This is a simple example of a shared library that listens for incoming requests on a specified port.
Create a `server.js` file in main repo and use the following code:

```javascript
import { EventBridgeListener } from "./dist/index.js";
import express from "express";

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const eventBridgeListener = new EventBridgeListener();

// Register one or more handlers
eventBridgeListener.registerHandler("MembershipCreated", (event) => {
  console.log("Handling MembershipCreated event:", event.detail);
  // Process the event data...
});

// Register additional event handlers as needed
// eventBridgeListener.registerHandler("AnotherEvent", handlerFunction);

// Attach the listener router to handle incoming events
app.use("/webhook", eventBridgeListener.router);

// Start the server
app.listen(port, () => {
  console.log(`Microservice listening on port ${port}`);
});
```
### Publishing Events
To publish events, you can use the `EventBridgePublisher` class.
Create a `publisher.js` file in main repo and use the following code:

```javascript
import { AWSEventBridgeBus } from "./dist/index.js";

async function publishMembershipEvent(eventBusName: string) {
  const region: string = process.env.AWS_REGION || "ap-southeast-2";

  const eventBus = new AWSEventBridgeBus(eventBusName, region);

  const membershipCreatedEvent = {
    type: "MembershipCreated", // event handling type
    source: "sera.membership", // source
    data: {         // event data
      user: "test@example.com",
      id: "67890"
    },
  };

  try {
    // Publish the event
    await eventBus.publish(membershipCreatedEvent);
    console.log("Membership created event published successfully.");
  } catch (error) {
    console.error("Failed to publish membership created event:", error);
  }
}

// pass name of event bus
publishMembershipEvent('specific-event-bus').catch(console.error)
```


## As Micorservice

### Listening to Events

Microservices can listen to AWS EventBridge events using the `EventBridgeListener` from this library.
Below is an example of how to set up event listeners in your service:

```javascript
import { EventBridgeListener } from "node-shared-libraries/dist/index.js";
import express from "express";

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const eventBridgeListener = new EventBridgeListener();

// Register one or more handlers
eventBridgeListener.registerHandler("MembershipCreated", (event) => {
  console.log("Handling MembershipCreated event:", event.detail);
  // Process the event data...
});

// Register additional event handlers as needed
// eventBridgeListener.registerHandler("AnotherEvent", handlerFunction);

// Attach the listener router to handle incoming events
app.use("/webhook", eventBridgeListener.router);

// Start the server
app.listen(port, () => {
  console.log(`Microservice listening on port ${port}`);
});
```

---

### Event Handling

- Events sent via AWS EventBridge will be received at `/webhook`.
- Each microservice can register event handlers for specific event types.
- Unregistered events will be ignored.

---

### Publishing Events
Microservices can publish events to AWS EventBridge using the `AWSEventBridgeBus` class from the shared library. Below is an example of how to publish a `MembershipCreated` event:

```javascript
import { AWSEventBridgeBus } from "node-shared-libraries/dist/index.js";

async function publishMembershipEvent(eventBusName: string) {
  const region: string = process.env.AWS_REGION || "ap-southeast-2";

  const eventBus = new AWSEventBridgeBus(eventBusName, region);

  const membershipCreatedEvent = {
    type: "MembershipCreated", // event handling type
    source: "sera.membership", // source
    data: {         // event data
      user: "test@example.com",
      id: "67890"
    },
  };

  try {
    // Publish the event
    await eventBus.publish(membershipCreatedEvent);
    console.log("Membership created event published successfully.");
  } catch (error) {
    console.error("Failed to publish membership created event:", error);
  }
}

// pass name of event bus
publishMembershipEvent('specific-event-bus').catch(console.error)
```

### Event Publishing
- Ensure the AWS EventBridge event bus is properly configured.
- The event type and source should match what listeners are expecting.
- Handle errors gracefully to ensure reliability.

---

Let me know if you need any modifications! 🚀
