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