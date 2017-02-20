
function index(request, response) {
  response.json({books: [3, 4, 5]})
}

function addRoutes(app) {
  app.get('/', index);
}

module.exports = {
  addRoutes
}
