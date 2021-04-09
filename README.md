# Status
Essential state management

### why Status?
9 times out of 10 you will probably only need: 
- set-state
- get-state
- subscribe
- unsubscribe

### Example 
```javascript 
import status from 'status';

status.set('dragon:animation', 'start');
status.get('dragon:animation'); // 'start'
status.subscribe('dragon:animation', 'moat', ({value}) => animateMoat(value));
status.unsubscribe('dragon:animation', 'moat');  // Removes moat from dragon:animation 

```

### What about async?
Ideally this should be handeled outside of state-machines.

### Why no middleware?
Subscritions provide similar functionality but in a more granular way.

### Multiple stores?
One store is the ideal goal. Multiple stores will have negligible difference to garbage collection.
Denoted namespaces can solve complexity issues.

### why no DSL support 
A lot can be achieved with one or two methods.
```javascript
state.set('nav', 'open'); 
state.subscribe(() => <do something here>);
```
### Advanced (mutate)
Status has another method `status.mutate` which lets you directly overwrite the two core objects: 
- store 
- subscribers
- 
It goes without saying, you should only touch this method if you know what you understand the risks. `mutate` is ideal for storing state in local storage as well as modifying the state when being retrieved from local storage. 


