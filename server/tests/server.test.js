const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:'first test todo'
}, {
  _id: new ObjectID(),
  text:' second text todo',
  completed: true,
  completedAt: 4444
}];

const fakeId = {
  _id: new ObjectID(),
  text: 'fake ID text'
}

beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      Todo.insertMany(todos)  // primes the database with the two todos above
    }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text})
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((err) => done(err));
      })
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) {
          return done(err);
        }
        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          }).catch((e) => done(e));
      })
  })
});

describe('GET /todos', () => {
  it('should get all todos (2)', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  })
  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${fakeId._id.toHexString()}`)
      .expect(404)
      .end(done);
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  })
})

describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hexID = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((res)=> {
          expect(res.body.todo._id).toBe(hexID);
        })
        .end((err,res) => {
          if(err) {
            return done(err);
          }
          Todo.findById(hexID)
            .then((todo) => {
              expect(todo).toNotExist();
              done();
            }).catch((e) => done(e));
        });
  });
  it('should return 404 if todo not found', (done) => {
    var hexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos[1]/${hexID}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 if object id is not valid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  })
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexID = todos[0]._id.toHexString();
    let text = ' this should be the new text'
    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)

  });
  it('should clear completedAt when todo is not completed', (done) => {
    var hexID = todos[1]._id.toHexString();
    let text = ' this should be the new text!!!'
    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done)
  });
});
