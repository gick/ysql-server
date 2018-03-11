const MultiRange = require('multi-integer-range').default;
let schemas = []
schemas.push({
    name:'ED', 
    pages:new MultiRange('1-9').toArray()
})
schemas.push({
    name:'AB', 
    pages:new MultiRange('10-26').toArray()
})
schemas.push({
    name:'MA', 
    pages:new MultiRange('27-43').toArray()
})
schemas.push({
    name:'SI', 
    pages:new MultiRange('44-53').toArray()
})
schemas.push({
    name:'FA', 
    pages:new MultiRange('54-68').toArray()
})
schemas.push({
    name:'DI', 
    pages:new MultiRange('69-77').toArray()
})
schemas.push({
    name:'DS', 
    pages:new MultiRange('78-92').toArray()
})
schemas.push({
    name:'VU', 
    pages:new MultiRange('93-104').toArray()
})
schemas.push({
    name:'EU', 
    pages:new MultiRange('105-115').toArray()
})
schemas.push({
    name:'SB', 
    pages:new MultiRange('116-125').toArray()
})
schemas.push({
    name:'SS', 
    pages:new MultiRange('126-142').toArray()
})
schemas.push({
    name:'EI', 
    pages:new MultiRange('143-151').toArray()
})
schemas.push({
    name:'US', 
    pages:new MultiRange('152-167').toArray()
})
schemas.push({
    name:'ET', 
    pages:new MultiRange('168-178').toArray()
})
schemas.push({
    name:'IS', 
    pages:new MultiRange('179-193').toArray()
})
schemas.push({
    name:'AS', 
    pages:new MultiRange('194-207').toArray()
})
schemas.push({
    name:'NP', 
    pages:new MultiRange('208-218').toArray()
})
schemas.push({
    name:'PU', 
    pages:new MultiRange('219-232').toArray()
})

getSchema=function(questionNumber)
{
   return schemas.find((value)=>{
        let index=value.pages.indexOf(questionNumber)
        if(index===-1){
            return false
        }
        return true
    })
}
module.exports=getSchema