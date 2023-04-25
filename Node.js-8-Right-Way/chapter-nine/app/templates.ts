import * as Handlebars from 'handlebars/dist/handlebars'

export const main = Handlebars.compile(`
    <div class="container">
        <h1>B4 - Book Bundler</h1>
        <div class="b4-alerts"></div>
        <div class="b4-main"></div>
    </div>
`);
export const welcome = Handlebars.compile(`
    <div class="jumbotron">
        <h1 class="text-success">Welcome!</h1>
        <p>B4 is an application for creating book bundles.</p>
        {{#if session.auth}}
        <p>View your <a href="#list-bundles">bundles</a>.</p>
        {{else}}
        <div class="col-5">
            <form>
              <p>Login in to begin</p>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" aria-describedby="nameHelp">
                <div id="nameHelp" class="form-text">Enter your registered user name</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" aria-describedby="passwordHelp">
                <div id="passwordHelp" class="form-text">Enter your password</div>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
        {{/if}}
    </div>
`);
export const alert = Handlebars.compile(`
  <div class="alert alert-{{type}} alert-dismissible fade show" role="alert">
    {{message}}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
`);

export const listBundles = Handlebars.compile(`
    <div class="panel panel-default">
        <div class="panel-heading">Your Bundles</div>
            {{#if bundles.length}}
                <table class="table">
                    <tr>
                        <th>Bundle Name</th>
                        <th>Actions</th>
                    </tr>
                    {{#each bundles}}
                    <tr>
                        <td>
                            <a href="#view-bundle/{{id}}">{{name}}</a>
                        </td>
                        <td>
                            <button class="btn btn-outline-danger btn-sm delete" data-bundle-id="{{id}}">Delete</button>
                        </td>
                    </tr>
                    {{/each}}
                </table>
            {{else}}
                <div class="panel-body">
                    <p>No bundles created yet!</p>
                </div>
            {{/if}}
    </div>
`);

export const addBundleForm = Handlebars.compile(`
    <div class="panel panel-default">
        <div class="panel-heading">Create a new bundle.</div>
        <div class="panel-body">
        <form>
            <div class="input-group">
                <input class="form-control" placeholder="Bundle Name" />
                <span class="input-group-btn">
                    <button class="btn btn-primary" type="submit">Create</button>
                </span>
            </div>
        </form>
        </div>
    </div>
`);