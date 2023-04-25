import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'
import * as templates from './templates';

document.body.innerHTML = templates.main();

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

const getBundles = async () => {
    const esRes = await fetch('/es/b4/_doc/_search?size=1000');
    const esResBody = await esRes.json();
    return esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
    }));
}
const listBundles = bundles => {
    mainElement.innerHTML = templates.addBundleForm() + templates.listBundles({bundles});
    const form = mainElement.querySelector('form');
    form.addEventListener('submit', event =>{
        event.preventDefault();
        const name = form.querySelector('input').value;
        addBundle(name).finally();
    });
    const deleteButtons = mainElement.querySelectorAll('button.delete');
    for (let i = 0; i < deleteButtons.length; i++) {
        const deleteButton = deleteButtons[i];
        deleteButton.addEventListener('click', () => {
            deleteBundle(deleteButton.getAttribute('data-bundle-id'))
                .catch(error => showAlert(error));
        });
    }
}
const showAlert = (message, type =  'danger') => {
    const html = templates.alert({message,type});
    alertsElement.insertAdjacentHTML('beforeend', html);
}

const addBundle = async (name) => {
    try{
        const bundles = await getBundles();
        const url = `/api/bundle?name=${encodeURIComponent(name)}`;
        const res = await fetch(url,{method: 'POST'});
        const resBody = await res.json();

        bundles.push({id: resBody._id, name});
        listBundles(bundles);

        showAlert(`Bundle "${name}" created!`, 'success');
    }catch (error){
        showAlert(error);
    }
}

const deleteBundle = async (bundleId) =>{
      const url = `/api/bundle/${bundleId}`
      const res = await fetch(url, {method: 'DELETE'});
      await res.json();
      const bundles = await getBundles();
      bundles.splice(bundles.findIndex(bundle => bundle.id === bundleId), 1);
      listBundles(bundles);
      showAlert('Bundle deleted!', 'success');
};

const showView = async () => {
  const [view, ...params] = window.location.hash.split('/');
  switch (view) {
      case '#welcome':
        mainElement.innerHTML = templates.welcome();
        break;
      case '#list-bundles':
          const bundles = await getBundles();
          listBundles(bundles);
          break;
      default:
        throw Error(`Unrecognized view: ${view}`);
    }
};

window.addEventListener('hashchange', showView);

showView().catch(_ => window.location.hash = '#list-bundles')