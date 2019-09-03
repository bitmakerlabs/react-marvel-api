# React Marvel API

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Setup](#setup)
- [Branches](#branches)
- [Exercises](#exercises)
  - [Exercise 0: Setting Up The Environment](#exercise-0-setting-up-the-environment)
  - [Exercise 1: Implementing Characters Search](#exercise-1-implementing-characters-search)
  - [Exercise 2: Viewing Character Details](#exercise-2-viewing-character-details)
  - [Exercise 3: Implementing 'Load More'](#exercise-3-implementing-load-more)
  - [Exercise 4: Adding Support For Comics](#exercise-4-adding-support-for-comics)
- [Resources](#resources)
- [Attribution](#attribution)

## Overview
Hello, and welcome to the Marvel API project. This repository includes a React
application that consumes and displays data from the Marvel API. Specifically,
this application allows users to search for Marvel characters (eg. Ghost Rider)
and comics (eg. The Amazing Spider-Man) by name.

## Installation
To get started, clone or download  this repository to your local filesystem.

## Setup
Once you've cloned or downloaded this repository you your local filesystem,
navigate to the root directory and run the following command: `npm install`.

After the dependencies have been installed, boot up the application by running:
`npm run start`. This will create a local server that listens for requests on
`localhost:3000`. To confirm that everything is working as expected, navigate to
`localhost:3000` in your browser of choice.

## Branches
This repository includes a series of branches, each of which contain a different
version of the application:

- **`master`:**
  - Contains a 'featureless' version of the application. All UI
    components are present, but the search functionality has not been
    implemented. Use this branch if you're starting the exercise from scratch.
- **`ex-1/characters-search`:**
  - This branch allows users to search for characters by name. Each result
    includes the name of the character and a thumbnail image, both of which are
    displayed in a 'card' format.
- **`ex-2/character-details`:**
  - This branch allows user to view details about a specific character.
- **`ex-3/load-more`**:
  - This branch allows users to view additional characters by clicking on a
    'Load More' button.
- **`ex-4/comics`:**
  - This branch includes the final version of the application. In addition to
    the features listed above, this version allows users to search for
    Marvel comics by name, to 'Load More' comics, and to view details about
    specific comics.

## Exercises

### Exercise 0: Setting Up The Environment

#### Before You Start
Before you start this exercise, make sure that the application can be run via
`npm run start`.

#### Overview
The goal of this exercise is to register for Marvel developer account, create a
new Marvel API key, and add the API key to the application.

#### Steps

##### Step 1: Creating A Marvel Developer Account
Start by navigating to the
[Marvel API Documentation](https://developer.marvel.com/docs) page and clicking
on the 'Get A Key' link located near the top of the page. If you do not already
have a Marvel Developer account, you will be prompted to create one.

To create a new Marvel Develop account, following the instructions provided.
After you've successfully created an account, the Marvel website should redirect
you the 'Get A Key' page. If it doesn't, navigate back to the Marvel API
Documentation page and click on the 'Get A Key' link near the top of the page.

##### Step 2: Creating A Marvel API Key
At this point you should be taken to the
[Marvel Developer Account](https://developer.marvel.com/account) page.
You should be presented with a public and private API key by default.  If you
see the public and private keys, proceed to the next step. If you do not, return
to the Marvel API Documentation page and following the instructions for creating
an API key.

##### Step 3: Allowing Requests From `localhost`
By default, the Marvel API will only respond to requests that originate from the
`marvel.com` website. Since our application will be running on `localhost`,
any requests it makes to the Marvel API will fail.

To fix this we must add `localhost` to the list of valid domains. Navigate to
the [Marvel Developer Account](https://developer.marvel.com/account) page and
scroll down until you see an area labelled 'Your authorized referrers'. Click
the 'Add a new referrer' link and enter `localhost` within the newly created
field. Finally, scroll down and click on the 'Update' link in the bottom right
hand corner of the page. If the referrer was added successfully, an 'Account
Updated' message will be displayed.

##### Step 4: Adding The API Key To The Application
Finally, we must add the new API key to our application. To do this, we'll start
by copying the public API key from the
[Marvel Developer Account](https://developer.marvel.com/account) page. Then
we'll open the `.env` file in the root of the repository and replace the
`<REPLACE_WITH_YOUR_OWN_KEY>` string with the public API key.

Since the application only reads the `.env` file when the development server
spins up, make sure to restart the application.

At this point your application should have access to a valid key that will allow
it to make up to 3,000 requests against the Marvel API per day.

### Exercise 1: Implementing Characters Search

#### Before You Start
Before you start this exercise, please make sure that you've registered for a
Marvel API key, added it to the `.env` file, and are able to run the
application. An overview of how to do this has been provided in Exercise 0.

#### Overview
The goal of this exercise is to allow users to search for Marvel characters by
name. Currently, interacting with the search bar has no effect. When we're done,
entering a character's name and clicking 'Search' will retrieve any related data
from the Marvel API and display the results in a 'card' format.

#### Steps

##### Step 1: Setting The Loading State
This application contains a dedicated 'loading' component (`<Loading />`) that
we will display whenever a search request is in flight. Additionally, the
`App`'s `render()` method is already set up to display this component whevener
the application is in a'loading state.

To put the application in a loading state, open the `App.js` file, navigate to
the `fetchCharacters()` method, and add the following line:

```
this.setState({ isLoading: true });
```

This tells the application to enter a loading state whenever the
`fetchCharacters()` method is called, meaning that our `<Loading />` component
will be displayed. You can test this functionality by booting up the app and
submitting a search via the search bar.

##### Step 2: Calling `getCharcters()`
Although the `App` has a method called `fetchCharacters()`, the actual request
to the Marvel API will be handled by our `MarvelService`. The `MarvelService`'s
responsibility is to interact with the Marvel API, and to make the response data
available to the `App`.

With that in mind, we'll update the `App`'s `fetchCharacters()` to call the
`MarvelService`'s `getCharacters()` method. To do this, we'll add the following
line to the `fetchCharacters()` method:

```
this.marvelService.getCharacters();
```

##### Step 3: Updating `getCharacters()`
Great, we're now calling the `getCharacters()` method whenever the user submits
a new search. However, there is only *small* problem: it doesn't actually do
anything. Not to worry, we'll address that in this step.

In order to retrieve character data from the Marvel API, the `getCharacters()`
method must do the following:
- Prepare an object of request parameters.
- Extract the correct endpoint from the `ENDPOINTS` object.
- Dispatch the request using Axios.

Additionally, `getCharacters()` will be responsble for extracting the meaningful
data for the response and returning it in the form of a Promise. No big deal?
Alright then, let's get started!

First we'll define a new local variable called `params`. For the value, we'll
start with an empty object. Add the following to `getCharacters()`:

```
const params = {};
```

This object will eventually be passed to Axios, which will convert it into a
series of query string parameters (eg. '?key=value', etc.). With that in mind,
let's update the object so that it's not empty. Within the object literal,
spread out the contents of the `config` parameter. This parameter will be
provided whenever `getCharacters()` is called, and will contain information that
should be part of each request. At this point our `params` assignment should
look something like this:

```
const params = { ...config };
```

This is a great start, but we're missing one important piece: the API key. Each
request to the Marvel API must include the API key. If it doesn't, the request
will fail. Luckily our `MarvelService` contains a method whose sole purpose is
to return the API key: `getAuthConfig()`.

Since `getAuthConfig()` returns an object that contains the API key, we can call
this method and spread the result into our `params` object. Update the `params`
assignment so that it looks like the following:

```
const params = { ...config, ...this.getAuthConfig() };
```

Great, we now have an object of params that contains everything in `config`, as
well as the API key that each request requires.

Next we'll define the local `endpoint` variable, which will contain the Marvel
API's characters endpoint. The `MarvelService` exposes the `ENDPOINTS` class
property, which includes all of the endpoints that we need for this exercise.
For this step, add the following line below the `params` assignment:

```
const endpoint = MarvelService.ENDPOINTS.characters;
```

Alright, we have our `params` *and* our `endpoint`. All that's left to do is
make the request! To do this, we'll call `axios.get()`, passing in the endpoint
as the first argument, and an object containing our params as the second
argument. At this point, our code should look something like this:

```
const params = { ...config, ...this.getAuthConfig() };

const endpoint = MarvelService.ENDPOINTS.characters;

axios.get(endpoint, { params: params });
```

Hooray, we've made a request to the chracters endpoint using the parameters
provided. However, we said that we also  wanted to parse and the response, which
we're *not* doing at the moment. To fix this, let's add a `then()` method the
end of our `get()` call. We'll provide a callback that will be invoked with the
`response` rom the Marvel API. At this point, the Axios code snippet should look
something like this:

```
axios.get(endpoint, { params: params })
  .then((response) => {
    ...
  });
```

Now that we have access to the API response, we can inspect, parse, and return
it. As a starting point, trying printing the `response` using `console.log()`.
You'll see it's a generic Axios response, which contains information like
`config`, `headers`, and `status`. It also includes a property called `data`,
which points to the information sent back by the Marvel API.

The Marvel API response contains *a lot* of information, but we'll only
interested in a small portion of it. Specifically, the API response *also*
includes a key of `data`, which is what we want to make avaialble to our
application. Let's update the Axios code snippet so that it looks like this:

```
axios.get(endpoint, { params: params })
  .then((response) => {
    return response.data.data;
  });
```

Great, we're almost done. As a last step, we'll make the Axios Promise available
wherever `getCharacters()` was invoked by adding a `return` statement just
before `axios.get()`. At this point, our code should look something like this:

```
return axios.get(endpoint, { params: params })
  .then((response) => {
    return response.data.data;
  });
```

##### Step 3: Displaying The Results
Now that the `getCharacters()` method is correctly dispatching our search
request, we should update the `App` component's `fetchCharacters()` method to
make use of it. To do this, we'll chain a `then()` method onto the
`getCharacters()` call. We'll also provide a callback that will be invoked with
`data`. At this point, the `getCharacters()` code snippet should look something
like this:

```
this.marvelService.getCharacters()
  .then((data) => {
    ...
  });
```

As a sanity check, let's print out the `data` using `console.log()`. Now,
whenever we submit a search, the console should display an object containing
`results`, `total`, `offset`, and `count`.

Now that we've identified where the actual search results are stored (ie. at the
`results` property of the `data` object), we can add them to our application
state using `setState()`. Let's update the `then()` callback to do exactly this:

```
this.marvelService.getCharacters()
  .then((data) => {
    this.setState({ results: data.results });
  });
```

This will cause the application to re-render using the results of the most
recent search. However, since our application is in loading state, the results
will not actually be displayed. To fix this, we'll tell the application that
it should not longer be in a loading state after we receive search results. We
can make use of our new `setState()` call to do this:

```
this.marvelService.getCharacters()
  .then((data) => {
    this.setState({ results: data.results, isLoading: true });
  });
```

##### Step 4: Applying The Current Search Term
If you tested the previous step then you may have noticed that something is not
quite right. Submitting a new search *does* fetch and display Marvel Character
data. However, each search returns the exact same results, regardless of the
search term.

Our application is capturing the latest search term under the `searchTerm`
property of the application state, but we're not including it as part of our
requests to the Marvel API. To fix this issue we'll have to make a small
adjustment to our `fetchCharacters()` method.

Within `fetchCharacters()`, we're currently calling the `getCharacters()` method
of the `MarvelService`. However, notice that we haven't provided any arguments.
If you completed Step 3 recently, you'll remember that `getCharacters()` expects
to be called with an object that includes the request parameters.

The Marvel API is fairly restrictive, which means that we can only send *valid*
request parameters. Sending invalid or unknown parameters will cause our
requests to fail. When we're requesting character data, the Marvel API accepts
a parameter called `nameStartsWith`, which it will use tailor the results of the
search. Let's update our use of `getCharacters()` to include an object with this
paramter:

```
this.marvelService.getCharacters({ nameStartsWith: this.state.searchTerm })
  .then((data) => {
    this.setState({ results: data.results, isLoading: true });
  });
```

Notice that we used `this.state.searchTerm` as the value for the
`nameStartsWith` parameter. This ensures that each search request includes the
latest search term.

If we re-test the search flow, we should see that the search results now relate
to the current search term. Test it out by searching for 'Spider-Man'.

##### Step 5: Handling Errors
The final step for this exercise is to account for cases where our requests
fail. This will require another slight adjustment to the `fetchCharacters()`
method.

Let's chain a `catch()` method to the existing `then()` method. This will be
called if and when the API request fails. We'll pass in a callback function,
which will be invoked with an error object.

```
this.marvelService.getCharacters({ nameStartsWith: this.state.searchTerm })
  .then((data) => {
    this.setState({ results: data.results, isLoading: true });
  })
  .catch((err) => {
    ...
  });
```

Within the body of the `catch()` callback, let's put our application into an
error state by calling `setState()` and passing in `{ hasError: true }`. This
will provide a visual cue to the user that something has gone wrong. At this
point, our code should look something like this:

```
this.marvelService.getCharacters({ nameStartsWith: this.state.searchTerm })
  .then((data) => {
    this.setState({ results: data.results, isLoading: true });
  })
  .catch((err) => {
    this.setState({ hasError: true });
  });
```

##### Step 6: Test It
Excellent, you've successfully added the character search funtionality to the
application, now why don't you give it a whirl. If everything is working as
expected, you should be able to:
- Search for characters by name.
- See the results in a 'card' format.

### Exercise 2: Viewing Character Details

#### Before You Start
Before starting this exercise, please make sure to complete exercise 1.
Alternatively, you may create a branch from `ex-1/characters-search`, which
includes the functionality introduced as part of exercises 1.

#### Overview
The goal of this exerise is to allow users to view additional information about
a given character. In terms of UX, the user will click on a character 'card',
which will cause a modal window with additional information to be displayed. All
of the required components exist, but it's up to us to define the methods that
will fetch the additional data.

#### Steps

##### Step 1: Updating `fetchCharacter()`
We'll start by updating the `fetchCharacter()` method within the `App`
component. Currently, this method doesn't do anything. However, it does include
some instructions (in the form of 'TODO') notes. We'll following the first note
by invoking the `getCharacter()` method of the `MarvelService`. At this point,
our code should look something like this:

```
this.marvelService.getCharacter();
```

Spoiler: the `getCharacter()` doesn't do anything at the moment. Not to worry,
we'll build it out as part of the next step. However, before we do that, we're
going to update our use of it. Notice that `getCharacter()` defines an `id`
paramter, which is the unique identifier for the character that we're interested
in. Let's pass this `id` into `getCharacter()` as an argument. Update the
`getCharacter()` code snippet so that it looks like this:

```
this.marvelService.getCharacter(id);
```

##### Step 2: Updating `getCharacter()`
Alright, now we can move on to the `getCharacter()` method of the
`MarvelService`. Just like `getCharacters()`, this method will have the
following responsibilities:
- Prepare an object of request parameters.
- Extract the correct endpoint from the `ENDPOINTS` object.
- Dispatch the request using Axios.

Let's start with the request parameters. In this case, we can actually copy and
paste the `params` assignment from `getCharacters()` into `getCharacter()`. When
you're done, you should have something like this:

```
const params = { ...config, ...this.getAuthConfig() };
```

Then we'll move on to defining the `endpoint` variable, which will be a bit
different. We'll start by assigning `endpoint` equal to the 'comic' endpoint,
like so:

```
const endpoint = MarvelService.ENDPOINTS.comic;
```

However, since the character ID must be included in the request endpoint, we'll
update our `endpoint` assignment to include it. We can use either string
concatenation or a template literal to achieve this, the choice is yours. The
string concatenation approach will give you something like this:

```
const endpoint = MarvelService.ENDPOINTS.comic + '/' + id;
```

Dont' forget to separate the 'comic' endpoint from the `id` using a forward
slash!

Now that we have our `params` and `endpoint`, we'll use `axios.get()` to
dispatch the request. Add the following below the `params` and `endpoint`
assignments:

```
axios.get(endpoint, { params: params });
```

Since we know that we're going to return the result of this request in the form
of a Promise, let's add the `return` keyword just before `axios.get()`:

```
return axios.get(endpoint, { params: params });
```

Alright, we're making a request for character data, but we're not actually doing
anything with the response. Just like with `getCharacters()`, we'll solve this
by adding a `then()` method to the end of our `axios.get()` call. We'll also
provide a callback function that will be invoked with an Axios `response`
object. At this point, our Axios code snippet should look like this:

```
return axios.get(endpoint, { params: params })
  .then((response) => {
    ...
  });
```

Both Axios and the Marvel API are consistent in terms of their responses,
meaning that the body of this callback can be exactly the same as the
`getCharacters()` callback. With that in mind, let's return
`response.data.data`. Now our Axios code snippet should look something like
this:

```
return axios.get(endpoint, { params: params })
  .then((response) => {
    return response.data.data;
  });
```

##### Step 3: Extracting The Character Data
Great, we're now making a request for specific character data and returning the
result in the form of a Promise. Let's jump back into the `fetchCharacter()`
method so that we can make use of the new data.

We'll start by chaining a `then()` method to the end of `getCharacter()` method.
We'll also provide a callback that will be invoked with the Marvel API `data`.
Like the `data` returned by `getCharacters()`, this will be an object with the
following keys: `results`; `total`; `offset`; and `count`. At this point, our
code should look something like this:

```
this.marvelService.getCharacter(id)
  .then((data) => {
    ...
  });
```

We're only interested in the `results` property at the moment, but there *is* a
small quirk. `results` is actually an array containing a single item. Since our
application expects the character data to be an object, we'll have to extract
the first item from the array before we update the application state. To do
this, update the body of the `then()` callback like so:

```
this.marvelService.getCharacter(id)
  .then((data) => {
    const result = data.results[0];
  });
```

Now that we have a single result, we can update the application state by setting
the `selectedResult` property. To do use, add a `setState()` call within the
body of the callback like so:

```
this.marvelService.getCharacter(id)
  .then((data) => {
    const result = data.results[0];
    this.setState({ selectedResult: result });
  });
```

##### Step 4: Handling Errors
Just like the previous exercise, The final step for this exercise is to account
for cases where our requests fail. This will require another slight adjustment
to the `fetchCharacter()` method.

Let's chain a `catch()` method to the existing `then()` method. This will be
called if and when the API request fails. We'll pass in a callback function,
which will be invoked with an error object.

```
this.marvelService.getCharacter(id)
  .then((data) => {
    const result = data.results[0];
    this.setState({ selectedResult: result });
  })
  .catch((err) => {
    ...
  });
```

Within the body of the `catch()` callback, let's put our application into an
error state by calling `setState()` and passing in `{ hasError: true }`. This
will provide a visual cue to the user that something has gone wrong. At this
point, our code should look something like this:

```
this.marvelService.getCharacter(id)
  .then((data) => {
    const result = data.results[0];
    this.setState({ selectedResult: result });
  })
  .catch((err) => {
    this.setState({ hasError: true });
  });
```

##### Step 5: Test IT
Awesome, now users can view additional information about specific characters.
Make sure that everything is working as expected by:
- Searching for a character by name (eg. 'Spider-Man').
- Clicking on one of the search results.
- Viewing the additional information within the details modal.

### Exercise 3: Implementing 'Load More'

#### Before You Start
Before starting this exercise, please make sure to complete exercises 1 and 2.
Alternatively, you may create a branch from `ex-2/character-details`, which
includes the functionality introduced as part of exercises 1 and 2.

#### Overview
The goal of this exercise is to introduce a 'Load More' feature as part of the
character search experience. Currently, users are only able to see the first 20
search results for a particular search term, even if the API is able to return
additional character data. Once implemented, the 'Load More' feature will allow
users to view additional results for a specific search term.

#### Steps

##### Step 1: Setting `canLoadMore`
Since we're going to add a 'Load More' button, we need some way of determining
if and when  it should be shown. Luckily, the Marvel API gives us just the
information we need.

In addition to the `results` field, the `/characters`
endpoint returns values for `total`, `count`, and `offset`. `total` represents
the total number of results for the search term, `count` represents the number
of results returned as part of the current request, and `offset` represents the
number of results that were skipped (more on that later). Using these three
values, we can determine whether the application should display  the 'Load More'
button.

Within `fetchCharacters()`, the callback function that we pass to our `then()`
method is setting the `results` property of the application state equal to
`data.results`. Let's update it to *also* set a new property: `canLoadMore`.
`canLoadMore` should contain a boolean value, which our application will use to
show or hide the 'Load More' button. Within our `setState()` call, let's add a
key of `canLoadMore`. For the value, we'll add an expression that will resolve
to either true or false: `data.total > data.offset + data.count`. At this point,
you should have something like this:

```
this.setState({
  results: data.results,
  canLoadMore: data.total > data.offset + data.count,
});
```

In this expression we're asserting that the total number of results is greater
than the offset ('skipped') plus the results returned as part of the cureent
request. If this is true, then there are more results to display. If this is
false, then there aren't. In either case we're captured the correct value within
the `canLoadMore` property of the application state.

##### Step 2: Displaying the 'Load More' Button
Now that we know whether or not to display the 'Load More' button, we can add it
to our `App` component.

Within the `App` component, import the `LoadMore` component like so:

```
import { LoadMore } from './components/LoadMore';
```

Once the component is available, we'll update the `App`'s `render()` method to
make use of it. Start by defining a new variable called `loadMoreElem`. If the
`canLoadMore` property of the application state is `true`, then `loadMoreElem`
should contain the `<LoadMore />` component. Otherwise, `loadMoreElem` should
contain an empty string (this will ensure that it's not displayed in cases where
it shouldn't be). At this point, you should have updated the `render()` method
to include something like this:

```
let loadMoreElem = '';

if (this.state.canLoadMore) {
  loadMoreElem = <LoadMore />;
}
```

Add the `loadMoreElem` to the return value of the `render()` method, in between
the `resultsElem` and the `detailsElem`. At this point, the return value should
look something like this:

```
...
{ resultsElem }
{ loadMoreElem }
{ detailsElem }
...
```

##### Step 3: Defining The `fetchMoreCharacters()` Method
At this point, our 'Load More' button should be shown or hidden depending on
whether the API is able to return additional results. However, clicking on the
button doesn't do anything. Let's fix that now!

We'll start by defining a new method in our `App`: `fetchMoreCharacters()`. This
method will be similar to the existing `fetchCharacters()`, except for two main
differences:
- This method will not put the application in a loading state (eg. the existing
  results will remain visible as we retrieve additional results).
- This method will *add* the additional results to the existing results.

Let's start by copying the body of the `fetchCharacters()` method into our new
`fetchMoreCharacters()` method. After that we'll remove the first line that
calls `setState()` (ie. the one that sets `isLoading` to `true`).

In order to work properly, `fetchMoreCharacters()` needs to retrieve *new*
results, rather than what's already on the page. In order to do this, we can
take advantage of the the Marvel API's `offset` parameter, which allows us to
'skip' a certain of results. Our servie is already set up to receive the
`offset` parameter, we just have to provide the right value.

To do this, we'll add an `offset` key to the object that we pass to
`getCharacters()`. For the value, we'll use: `this.state.results.length`. This
means that the Marvel API will 'skip' the number of results equal to however
many results we've already retrieved. If we've retrieved 20 results, calling
`fetchMoreCharacters()` will include an `offset` value of 20, etc. At this
point, your `getCharacters()` call should look something like this:

```
this.marvelService.getCharactersa({
  nameStartsWith: this.state.searchTerm,
  offset: this.state.results.length,
});
```

Once we've update the `getCharacters()` call to include the `offset` value,
we'll update the `then()` callback.  Since we are no longer setting
`isLoading` to `true` when `fetchMoreCharacters()` is called, we can remove the
`isLoading: false` key/value pair.

Finally, we can move on to updating the result
handling logic. Instead of setting the `results` property of the application
state to `data.results`, let's combine the additional and existing results into
a new array. This ensures that existing results remain visible to the user. When
you're done, the `setState()` call within the `then()` callback should look
something like this:

```
this.setState({
  results: [...this.state.results, ...data.results],
  canLoadMore: data.total > data.offset + data.count,
});
```

##### Step 4: Handling Errors
Our new `fetchMoreCharacters()` method is set up to request additional character
data, but we should always be in the habit of accounting for errors.

If you used `fetchCharacters()` as a starting point for `fetchMoreCharacters()`,
then the `catch()` method should already be in place. If you wrote
`fetchMoreCharacters()` from scratch, make sure to add a `catch()` method after
`then()`. Provide a callback function that accepts an error, prints the error to
the console, and puts the application into an error state. When you're done, you
should have something like this:

```
...
.then((data) => {
  ...
})
.catch((err) => {
  console.error(err);
  this.setState({ hasError: true });
});
```

##### Step 5: Attaching `fetchMoreCharacters()` To The 'Load More' Button
Now that we've defined `fetchMoreCharacters()`, it's time to make use of it.

Within our `App`'s `render()` method, update the `loadMoreElem` assignment as
follows:

```
let loadMoreElem = '';

if (this.state.canLoadMore) {
  loadMoreElem = <LoadMore onClick={ this.fetchMoreCharacters } />;
}
```

Since the `fetchMoreCharacters()` method will be called in the context of a
child component, we must bind it to ensure that this `this` value points to the
`App` component. To do this, add the following line to the `App`'s
`constructor()` method:

```
this.fetchMoreCharacters = this.fetchMoreCharacters.bind(this);
```

##### Step 6: Test It
Alright, you've completed all of the steps to add the 'Load More' functionality.
All that's left to do is test the new feature (and fix anything that may not be
working as expected).

To test this feature, try using a search term that is likely to return more that
20 results (eg. 'Spider'). If everything works as expected, the first 20 results
should be displayed, followed by the 'Load More' button. Clicking
the 'Load More' button should dispatch a request for 'more characters', which
will be added to the bottom of the page. This process should repeat until all of
the results for the current search term have been retrieved and displayed.

### Exercise 4: Adding Support For Comics

#### Before You Start
Before starting this exercise, please make sure to complete exercises 1, 2, and
3. Alternatively, you may create a branch from `ex-3/load-more`, which includes
the functionality introduced as part of exercises 1, 2, and 3.

#### Overview
The goal of this exercise is to allow users to search for comics for title,
'load more' comics, and view information about a specific comic. Essentially,
we're going to be duplicate the existing features, which focus on characters.

This exercise requires quite a few updates, but we'll be able use the existing
features and functionality for reference.

#### Steps

##### Step 1: Add `searchType` To Application State
Currently, our application only supports character-type searches. Since we're
going to support comic-type searches as well, we'll need to update the
applicaton state to track *which* type of search is currently active.

To do this, we'll add the `searchType` property to `state` object within the
`App` `constructor()` method. Since character-type searches will be the default,
we'll give it a value of 'Characters' to start. When you're done, the `state`
assigment in the `App` `constructor()` should look something like this:

```
...
this.state = {
  searchTerm: '',
  searchType: 'Characters',
  results: [],
  selectedResult: null,
};
...
```

##### Step 2: Update `<SearchBar />`
We need to allow the user to set the type of search. To do this, we'll update
the `<SearchBar />` component.

We'll start by passing the `searchType` value into `<SearchBar />` as a prop.
This will require a slight modification within the `App`'s `render()` method.
When you're done, the `<SearchBar />` reference should look something like this:

```
<SearchBar
  ...
  searchType={ this.state.searchType }
  ...
/>
```

Next we'll update the `SearchBar` class to render a component that will allow
the user to set the search type: `<SearchTypeControls />`.  Within
`SearchBar.js`, import the `SearchTypeControls` as follows:

```
import { SearchTypeControls } from './SearchTypeControls';
```

Now we can update the `SearchBar` component's `render()` method to include a
reference to the new component. To do this, add the `<SearchTypeControls />` in
between the `<input />` element and the `<button>`. Additionally, pass the
`searchType` value into the `<SearchTypeControls /> as a prop of the same name.
When you're done, the `SearchBar` `render()` method should include somthing like
this:

```
...
<SearchTypeControls
  searchType={ this.props.searchType }
/>
...
```

At this point, we should be able to preview the new UI. Booting up the app will
show us that the 'Characters' search is active by default. Since we set the
`searchType` property to 'Characters' within the `App` `constructor()`, this
makes sense. However, clicking on either of the options exposed by the
`SearchTypeControls` has no effect. Let's fix this next!

First we'll update the `<SearchBar />` component within the `App`'s `render()`
method. Currently, the `<SearchBar />` is given a function that updates the
`searchTerm` whenever it's called. This function is passed into the
`<SearchBar />` via the `onSubmit` prop. We'll use a similar approach to allow
the user to updated the `searchType` property.

We'll start by adding a `onSelect` property to the `<SearchBar />` component.
For the value, we'll define an arrow function that accepts a `searchType`
parameter, and uses it to update the `searchType` via `setState()`. When you're
done, the `<SearchBar />` component reference should look something like this:

```
<SearchBar
  ...
  onSelect={ (seachType) => this.setState({ searchType }) }
  ...
/>
```

Next we'll jump back into the `SearchBar` class definition, where we'll
update the `<SearchTypeControls />` to make use of the new prop. We'll add two
new props to the `<SearchTypeControls />` component:
- `onCharactersClick`.
- `onComicsClick`.

For the values, we'll define two new arrow functions. The
`onCharactersClick` arrow function will call `this.props.onSelect()`, passing in
the string 'Characters'. The `onComicsClick` arrow function will call
`this.props.onSelect()`, passing the string 'Comics'. When you're done, your
`<SearchTypeControls /> should look something like this:

```
<SearchTypeControls
  ...
  onCharactersClick={ this.props.onSelect('Characters') }
  onComicsClick={ this.props.onSelect('Comics') }
  ...
/>
```

##### Step 3: Add `getComics()` to `MarvelService`
Since we're going to be fetching an entirely new type of data — comics — we'll
need to update the `MarvelService` to include the appropriate method. Luckily,
the logic should be almost exactly the same as an exsting method:
`getCharacters()`.

We'll start by copying and pasting the `MarvelService`'s `getCharacters()` back
into itself, and renaming it to `getComics()`. Then we'll update the `endpoint`
assignment so that it's equal to `MarvelService.ENDPOINTS.comics`. (rather than
`...ENDPOINTS.characters`).`

##### Step 4: Add `fetchComics()` to `App`
Just like with the character-type searches, the `App` component will expose a
method that calls the underlying `MarvelService`. In this case, we'll call the
new method `fetchComics()`.

Let's start by copying and pasting the `App`'s `fetchCharacters()` method back
into itself, and renaming it to `fetchComics()`. Next we'll update the new
method so that it calls `this.marvelService.getComics()`, rather than
`getCharacters()`. Finally, we'll update the object that's passed to
`getComics()`, swapping our the `nameStartsWith` key for `titleStartsWith`. This
last update is required by the Marvel API. When searching for characters, the
API accepts the `nameStartsWith` parameter. However, when searching for comics,
the equivalent parameter is `titleStartsWith`.

If you used the existing `fetchCharacters()` method, then the error handling
logic should already be in place. If not, match sure to account for errors by
adding a `catch()` method call after the `then()`.

At this point, the `fetchComics()` method should look something like this:

```
fetchComics() {
  this.setState({ isLoading: true, hasError: false });

  this.marvelService.getComics({
    titleStartsWith: this.state.searchTerm,
  })
    .then((data) => {
      this.setState({
        results: data.results,
        isLoading: false,
        canLoadMore: data.total > data.offset + data.count,
      });
    })
    .catch((err) => {
      console.error(err);
      this.setState({ hasError: true });
    });
}
```

##### Step 5: Call `fetchComics()` On Update
To see our new `fetchComics()` method in action, we'll have to update the
exiting `componentDidUpdate()` method.

Currently the `componentDidUpdate()` method fetches new character data (via
`fetchCharacters()`) whenever the user submits a new search time. We'll need to
update the existing expression to also check for the presence of a new
`searchType`. To start, create two new variables:
- `searchType`: This will be equal to the current `searchType`, extracted from
  `this.state`.
- `prevSearchType`: This will be equal to the last `searchType`, extracted from
  `prevState`.

At this point, you should have added something like this:

```
const searchType = this.state.searchType;
const prevSearchType = prevState.searchType;
```

Next, we'll update our expression to include the `searchType` and
`prevSearchType` values. To describe the logic in plain terms, we want to fetch
new data when *either* of the following are true:
- A search term exists *and* the current search term is different from the last
  search term.
- A search term exists *and* the current search type is different from the last
  search type.

We can implement this as follows:

```
if (
  searchTerm
  && (searchTerm !== prevSearchTerm || searchType !== prevSearchType)
) { ... }
```

Notice the `searchTerm` and `searchType` assertions are grouped within the same
set of parentheses.` This is important to ensure that expression is evaluated in
the correct order.

At this point, the application should correctly fetch new data whenever the
search term changes or the search type changes. However, changing the search
type will cause the application to fetch character data, which is not what we
want. To correct this, we'll update the body of our `if` statement as follows:

```
if (
  searchTerm
  && (searchTerm !== prevSearchTerm || searchType !== prevSearchType)
) {
  if (searchType === 'Characters') {
    this.fetchCharacters();
  } else {
    this.fetchComics();
  }
}
```

Now the application will fetch character data when the `searchType` is
'Characters', and comic data when the `searchType` is 'Comics'.

##### Step 6: Fix Missing Comic Title
Our application is coming along nicely, but it looks like we've introduced a
defected. When we search for comics the card elements don't display the title of
each result. The Marvel API returns this data, but not under the same property
as the character results.

To fix this issue we need to update the `ResultsList`. If the current
`searchType` is 'Characters', then the `ResultsList` will extract the `name`
property of the each result and pass it down to the `ResultCard` component.
Alternatively, if the current `searchType` is 'Comics', the `ResultsList` will
extract and provide the `title` property.

We'll start by passing the `searchType` down from the `App` into the
`<ResultsList />` as a prop of the same name. Our `<ResultsList />` component
should now look something like this:

```
<ResultsList
  ...
  searchType={ this.props.searchType }
  ...
/>
```

Next we'll update the `ResultsList` class definition. Within the `render()`
method, we'll update the loop which creates the `<ResultCard />` components.
We'll update the value of the `title` prop to assert that the current
`searchType` is 'Characters'. If it is, then we'll pass in the `result.name` as
normal. If it's not, then we're display comic results and we can pass in
`result.title`.

At this point, the `<ResultCard />`-related code should look something like
this:

```
<ResultCard
  title={ this.props.searchType === 'Characters' ? result.title : result.name }
/>
```

##### Step 7: Add 'Load More' Comics
Now that we've fixed the title defect, we can move on to implementing 'Load
More' funtionality for comic-type searches. This step is a variaton of the 'Load
More' exercise, with a few minor adjustments.

We'll start by copying and pasting the `fetchMoreCharacters()` method from the
`App` back into itself, and renaming it to `fetchMoreComics()`. We'll also
change the `nameStartsWith` property to `titleStartsWith`, to account for the
slight difference in the Marvel API. At this point, our new method should look
something like this:

```
fetchMoreComics() {
  this.marvelService.getComics({
    titleStartsWith: this.state.searchTerm,
    offset: this.state.results.length,
  })
    .then((data) => {
      this.setState({
        results: [...this.state.results, ...data.results],
        canLoadMore: data.total > data.offset + data.count,
      })
    })
    .catch((err) => {
      console.error(err);
      this.setState({ hasError: true });
    });
}
```

Since this method will be used within the `<LoadMore />` component, me must bind
it to ensure that the `this` value always refers to the `App` component. To do
this, add the following line to the `App`'s `constructor()` method.

```
this.fetchMoreComics = this.fetchMoreComics.bind(this);
```

Finally, we'll update the `<LoadMore />` component reference so that it receives
*either* `fetchMoreCharacters()` or `fetchMoreComics()` based on the current
`searchType`. To do this, we'll update the `onClick` prop as follows:

```
<LoadMore
  onClick={
    this.state.searchType === 'Characters'
      ? this.fetchMoreCharacters
      : this.fetchMoreComics
  }
/>
```

Now the 'Load More' functionality should work for both character and comic-type
searches.

##### Step 8: Add Comic Details
Alright, we're down to the last feature: allowing users to view details about a
specific comic. Luckily this feature already exists for character-type searches,
so we have a point of reference.

We'll start by copying and pasting the `MarvelService`'s `getCharacter()` back
into itself, and renaming it to `getComic()`. Then we'll update the `endpoint`
assignment so that it's equal to `MarvelService.ENDPOINTS.comic`. (rather than
`...ENDPOINTS.character`).` Since this method performs basically the same
operation, we don't need to make any other changes.

Next we'll copy and paste the `App`'s `fetchCharacter()` method back
into itself, and rename it to `fetchComic()`. Then we'll update the new
method so that it calls `this.marvelService.getComic()`, rather than
`getCharacter()`. As both  `getCharacter()` and `getComic()` search by ID
(rather than by the `nameStartsWith` or `titleStartsWith` parameters), no
further changes are necessary.

Since this method will be used within a child component, me must bind
it to ensure that the `this` value always refers to the `App` component. To do
this, add the following line to the `App`'s `constructor()` method.

```
this.fetchComic = this.fetchComic.bind(this);
```

As a last step, we'll update the `<ResultsList />` component so that eithe
receives *either* the `fetchCharacter()` or `fetchComic()` method based on the
current `searchType`. If the `searchType` is equal to 'Characters', then we'll
pass in `fetchCharacter()`. Alternatvely, if the `searchType` is 'Comics', then
we'll pass in `fetchComic()`. To do this, update the `<ResultsList />` component
reference so that the `onResultClick` prop looks like the following:

```
<ResultsList
  ...
  onResultClick={
    this.state.searchType === 'Characters'
      ? this.fetchCharacter
      : this.fetchComic
  }
  ...
/>
```

At this point, clicking on a comic-type search result should fetch additional
data about that comic, and display the result within the result details modal.

##### Step 9: Test It
That's it, you made it! All that's left to do is test to make sure everything
works as expected. Oh, and to fix anything that doesn't of course!

To test the new features, boot up the application and complete the following:
- Perform a comic-type search by clicking on the 'Comics' button within the
 search bar, entering a search term, and clicking 'Search'. If everything
is working as expected, the search results should be comics (rather than
characters).
- Load more comics by performing an initial search for 'Spider', scrolling to
  the bottom of the results, and clicking on the 'Load More' button. If
everything is working as expected, additional comic-type results should be
loaded.
- View comic details by performing a comic-type search and clicking on any of
  the results. If everything is working as expected, the details modal should
contain information about the selected comic.

## Resources
- **Marvel API:**
  - [Account](https://developer.marvel.com/account)
  - [Documentation](https://developer.marvel.com/docs)
  - [API Key Registration](https://www.marvel.com/signin?referer=https%3A%2F%2Fdeveloper.marvel.com%2Faccount)
    - Please note: this requires a *free* Marvel developer account.
- **Axios:**
  - [Documentation](https://github.com/axios/axios)

## Attribution
Concept and material prepared by Jesse R Mykolyn for General General Assembly's
Bitmaker.

All character and comic information is the property of their respective owners.
