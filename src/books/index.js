
function index(request, response) {
  response.json({message: 'Welcome to our Bookstore!'})
}

function addRoutes(app) {
  app.get('/', index);
}

module.exports = {
  addRoutes
}
