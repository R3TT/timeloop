//--------------------------------------------------------------------------------------------------
// timeloop.js tracks the current time, deltaTime and related data. You can query it at any timeloop.  
// This is more appropriate for games, simulations, virtual worlds, visualizations, etc. than using  
// a strictly event oriented system.
//
// You can also subscribe to timing events. For instance, this is useful for creating a simple update
// loop.
// 
// Rett Crocker
// 
//--------------------------------------------------------------------------------------------------

var timeloop = timeloop || {};
exports = module.exports = timeloop;

////////////////////////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////////////////////////

// public properties
timeloop.version = '1.3.1';
timeloop.time = 0;
timeloop.deltaTime = 0;
timeloop.real = 0;
timeloop.frame = 0;
timeloop.scale = 1;

// private properties
timeloop.startTime = (new Date()).getTime();
timeloop.lastTime = timeloop.startTime;
timeloop.active = false;
timeloop.intervalId = null;

// subscriptions
timeloop.subscriptions = {};


////////////////////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------------------
// activate
// - start tracking time properties
//--------------------------------------------------------------------------------------------------
timeloop.activate  = function ()
{
    timeloop.active = true;
    timeloop.intervalId = setInterval( timeloop.Update, 1000 / 30.0 );
};


//--------------------------------------------------------------------------------------------------
// deactivate
// - stop tracking time properties
//--------------------------------------------------------------------------------------------------
timeloop.deactivate  = function ()
{
    timeloop.active = false;
    clearInterval( timeloop.intervalId );
};


//--------------------------------------------------------------------------------------------------
// subscribe
// - id is required
// - _callback will be called each update cycle
// - if _minDeltaTime is specified then the update cycle will only be called after _minDeltaTime has
//   elapsed
// 
// NOTE: this pattern is being used so that subscribers can be updated over time
//--------------------------------------------------------------------------------------------------
timeloop.subscribe  = function (id, _callback, _minDeltaTime)
{
    if (! timeloop.subscriptions.hasOwnProperty(id))
    {
        timeloop.subscriptions[id] = 
        {
            callback : null,
            minDeltaTime : 0,
            currDeltaTime : 0
        };
    }

    if (_callback) { timeloop.subscriptions[id].callback = _callback; }
    if (_minDeltaTime) { timeloop.subscriptions[id].minDeltaTime = _minDeltaTime; }
};


//--------------------------------------------------------------------------------------------------
// unsubscribe
// - unsubscribe from the update cycle
//--------------------------------------------------------------------------------------------------
timeloop.unsubscribe  = function (id)
{
    if (timeloop.subscriptions.hasOwnProperty(id))
    {
        delete timeloop.subscriptions[id];
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////
// INTERNAL METHODS
////////////////////////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------------------
// Update
// - internal method for updating time properties
//--------------------------------------------------------------------------------------------------
timeloop.Update = function ()
{
    if (! timeloop.active) { return; }
    var t = (new Date()).getTime();
    
    timeloop.deltaTime = ((t - timeloop.lastTime) / 1000) * timeloop.scale;
    timeloop.time = ((t - timeloop.startTime) / 1000) * timeloop.scale;
    timeloop.real = (t - timeloop.startTime) / 1000;
    timeloop.frame++;
    timeloop.lastTime = t;

    for (var id in timeloop.subscriptions)
    {
        var sub = timeloop.subscriptions[id];
        if (sub.callback)
        {
            sub.currDeltaTime += timeloop.deltaTime;
            if (sub.currDeltaTime >= sub.minDeltaTime)
            {
                sub.callback({deltaTime:sub.currDeltaTime, time:timeloop.time, real:timeloop.real});
                sub.currDeltaTime = 0;
            }
        }
    }
};

// start activated by default
timeloop.activate();

