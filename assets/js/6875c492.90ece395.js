(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[610],{4281:function(e,t,a){"use strict";a.d(t,{Z:function(){return d}});var r=a(2784),l=a(6277),n=a(876),s=a(7921),m=a(1510),i=a(3733),c=a(759),o="blogPostTitle_2v5P",g="blogPostDate_2hvg",u=a(7510);var d=function(e){var t,a,d=(t=(0,u.c2)().selectMessage,function(e){var a=Math.ceil(e);return t(a,(0,s.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:a}))}),p=e.children,h=e.frontMatter,E=e.metadata,v=e.truncated,b=e.isBlogPostPage,f=void 0!==b&&b,N=E.date,_=E.formattedDate,k=E.permalink,Z=E.tags,w=E.readingTime,T=h.author,P=h.title,M=h.image,y=h.keywords,L=h.author_url||h.authorURL,I=h.author_title||h.authorTitle,x=h.author_image_url||h.authorImageURL;return r.createElement(r.Fragment,null,r.createElement(c.Z,{keywords:y,image:M}),r.createElement("article",{className:f?void 0:"margin-bottom--xl"},(a=f?"h1":"h2",r.createElement("header",null,r.createElement(a,{className:(0,l.Z)("margin-bottom--sm",o)},f?P:r.createElement(m.Z,{to:k},P)),r.createElement("div",{className:"margin-vert--md"},r.createElement("time",{dateTime:N,className:g},_,w&&r.createElement(r.Fragment,null," \xb7 ",d(w)))),r.createElement("div",{className:"avatar margin-vert--md"},x&&r.createElement(m.Z,{className:"avatar__photo-link avatar__photo",href:L},r.createElement("img",{src:x,alt:T})),r.createElement("div",{className:"avatar__intro"},T&&r.createElement(r.Fragment,null,r.createElement("h4",{className:"avatar__name"},r.createElement(m.Z,{href:L},T)),r.createElement("small",{className:"avatar__subtitle"},I)))))),r.createElement("div",{className:"markdown"},r.createElement(n.Zo,{components:i.Z},p)),(Z.length>0||v)&&r.createElement("footer",{className:"row margin-vert--lg"},Z.length>0&&r.createElement("div",{className:"col"},r.createElement("strong",null,r.createElement(s.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),Z.map((function(e){var t=e.label,a=e.permalink;return r.createElement(m.Z,{key:a,className:"margin-horiz--sm",to:a},t)}))),v&&r.createElement("div",{className:"col text--right"},r.createElement(m.Z,{to:E.permalink,"aria-label":"Read more about "+P},r.createElement("strong",null,r.createElement(s.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More")))))))}},7684:function(e,t,a){"use strict";a.d(t,{Z:function(){return u}});var r=a(2784),l=a(6277),n=a(1510),s="sidebar_3j6c",m="sidebarItemTitle_2KH5",i="sidebarItemList_3Uli",c="sidebarItem_1R5P",o="sidebarItemLink_3Uuq",g="sidebarItemLinkActive_1m4O";function u(e){var t=e.sidebar;return 0===t.items.length?null:r.createElement("div",{className:(0,l.Z)(s,"thin-scrollbar")},r.createElement("h3",{className:m},t.title),r.createElement("ul",{className:i},t.items.map((function(e){return r.createElement("li",{key:e.permalink,className:c},r.createElement(n.Z,{isNavLink:!0,to:e.permalink,className:o,activeClassName:g},e.title))}))))}},4433:function(e,t,a){"use strict";a.r(t);var r=a(2784),l=a(7902),n=a(4281),s=a(1510),m=a(7684),i=a(7921),c=a(7510);function o(e){var t,a=e.tagName,l=e.count,n=(t=(0,c.c2)().selectMessage,function(e){return t(e,(0,i.I)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:e}))});return r.createElement(i.Z,{id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",values:{nPosts:n(l),tagName:a}},'{nPosts} tagged with "{tagName}"')}t.default=function(e){var t=e.metadata,a=e.items,g=e.sidebar,u=t.allTagsPath,d=t.name,p=t.count;return r.createElement(l.Z,{title:'Posts tagged "'+d+'"',description:'Blog | Tagged "'+d+'"',wrapperClassName:c.kM.wrapper.blogPages,pageClassName:c.kM.page.blogTagsPostPage,searchMetadatas:{tag:"blog_tags_posts"}},r.createElement("div",{className:"container margin-vert--lg"},r.createElement("div",{className:"row"},r.createElement("div",{className:"col col--3"},r.createElement(m.Z,{sidebar:g})),r.createElement("main",{className:"col col--7"},r.createElement("h1",null,r.createElement(o,{count:p,tagName:d})),r.createElement(s.Z,{href:u},r.createElement(i.Z,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page"},"View All Tags")),r.createElement("div",{className:"margin-vert--xl"},a.map((function(e){var t=e.content;return r.createElement(n.Z,{key:t.metadata.permalink,frontMatter:t.frontMatter,metadata:t.metadata,truncated:!0},r.createElement(t,null))})))))))}}}]);