
// function asyncHandler(handlerFunction) {
//     return function (req, res, next) {
//       Promise
//         .resolve(handlerFunction(req, res, next))
//         .catch(next);
//     };
//   }
  
module.exports= (fn)=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next);
}

