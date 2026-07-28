// asyncHandler — بيلف أي دالة async في الـ controllers عشان لو حصل خطأ (Promise rejected)
// يتبعت تلقائيًا لـ Express عن طريق next(err) بدل ما نكتب try/catch في كل دالة لوحدها
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = asyncHandler
