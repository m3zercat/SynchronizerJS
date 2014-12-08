function Synchronizer () {
    this.functions = [[]];
    this.pointer = 0;
    this.flag = 0;
}

(function(p){

    /*
    function must accept at least one argument which is the callback
    */
    p.enqueue = function(func, args)
    {
        // that = this because inside anonymous function this can be something else
        var that = this;
        if(args === null || args === undefined)
        {
            args = [];
        }
        this.functions[this.functions.length-1].push(function(){
            that.flag++; // increase flag to show how many we are waiting on completion for
            args.push(function(){
                that.flag--;
                if(that.flag === 0)
                {
                    that.run(); // if we have reached flag 0 we are ready to move past the barrier to next
                }
            });
            func.apply({}, args);
        });
    };

    p.barrier = function()
    {
        if(this.functions[this.functions.length-1].length > 0){
            this.functions.push([]);
        }
    };

    p.run = function() {
        if(this.pointer >= this.functions.length)
        {
            // if we are pointing at the end of the list we are done and any call here is nonsensical
            // therefore we add a barrier to the end of the list 
            // to delineate new functions from whatever we just ran
            this.barrier();
        }
        else
        {
            // increment pointer first because the final function will call run before returning.
            // must refer to pointer before increment though
            pointr = this.pointer;
            this.pointer++;

            for(var i = 0; i < this.functions[pointr].length; i++) // foreach function before next barrier
            {
                this.functions[pointr][i](); // execute async function
            }
        }
    };

    p.enqueueSync = function(func, args) {
        this.enqueue(function(callback){
            func.apply({}, args);
            callback();
        });
    };

    p.toggleLoading = function(show){
        if(show !== true && show !== false)
        {
            return;
        }
        if(show)
        {
            $('#loading').css('display', 'block');
        }else{
            $('#loading').css("display", "none");
        }
    };
    
    p.addAsyncExpectation = function(func, args)
    {
        this.enqueue(func, args);
    };

    p.addBarrier = function(){
        this.barrier();
    };

})(Synchronizer.prototype);

/*

function asyncTestWorkUnit(num, msg, callback){
    var delay = Math.floor((Math.random() * 3000) + 1);
    setTimeout(function(){
        console.log(msg+"."+num+" entering callback");
        callback();
    }, delay);
}
function synchronizerTest () {
    var syncer = new Synchronizer();
    var i = 1;
    var j = 1;
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addBarrier(); j++;

    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addBarrier(); j++;

    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addAsyncExpectation(asyncWorkUnit, [i++, j]);
    syncer.addBarrier(); j++;

    syncer.run();

}

synchronizerTest();

*/
