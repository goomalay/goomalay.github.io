let page = 1;
const perPage = 12;
let allPosts = [];
let filteredPosts = [];

const container = document.getElementById("post-container");
const loader = document.getElementById("loader");
const searchBox = document.getElementById("searchBox");
const filterBox = document.getElementById("categoryFilter");

fetch('/posts.json')
  .then(r => r.json())
  .then(data => {
    allPosts = data;
    filteredPosts = data;
    buildFilter();
    render();
  });

function buildFilter(){
  const cats = [...new Set(allPosts.map(p => p.category))];
  cats.forEach(c=>filterBox.innerHTML += `<option>${c}</option>`);
}

function skeleton(count=6){
  loader.innerHTML='';
  for(let i=0;i<count;i++) loader.innerHTML+=`<div class="skeleton"></div>`;
}

function render(){
  skeleton();
  setTimeout(()=>{
    const start=(page-1)*perPage, end=page*perPage;
    filteredPosts.slice(start,end).forEach(post=>{
      container.insertAdjacentHTML("beforeend",`
      <article class="post-card fade">
        <a href="${post.url}" class="card-link-wrapper">
          <div class="thumb-container">
            <img data-src="${post.image}" class="lazy">
            <span class="live-tag">LIVE</span>
          </div>
          <div class="post-info">
            <span class="category">${post.category}</span>
            <h3>${post.title}</h3>
            <p class="program-desc">${post.program}</p>
          </div>
        </a>
      </article>`);
    });
    lazyLoad();
    loader.innerHTML='';
  },500);
}

function lazyLoad(){
  document.querySelectorAll("img.lazy").forEach(img=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          img.src=img.dataset.src;
          img.classList.remove("lazy");
          obs.disconnect();
        }
      });
    });
    obs.observe(img);
  });
}

window.addEventListener("scroll",()=>{
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 600){
    if(page * perPage < filteredPosts.length){
      page++;
      render();
    }
  }
});

searchBox.oninput=()=>{
  page=1; container.innerHTML='';
  filteredPosts = allPosts.filter(p =>
    p.title.toLowerCase().includes(searchBox.value.toLowerCase())
  );
  render();
};

filterBox.onchange=()=>{
  page=1; container.innerHTML='';
  filteredPosts = filterBox.value ?
    allPosts.filter(p=>p.category===filterBox.value) :
    allPosts;
  render();
};
