webpackJsonp([1],{J91o:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=e("9rMa"),n={computed:Object(o.b)({notes:function(t){return t.notes}}),methods:{addNotes:function(){this.$router.push({name:"AddNotes"}),this.$store.dispatch("addOrUpdate","add")},editNotes:function(t){this.$store.dispatch("updateNotes",t),this.$store.dispatch("addOrUpdate","update"),this.$router.push({name:"AddNotes",query:{id:t.id}})}},mounted:function(){console.log(this.$store)}},i={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"notesList"},[t._l(t.notes,function(s,o){return e("div",{staticClass:"notesItem",class:{isTop:s.isTop},on:{click:function(e){t.editNotes(s)}}},[e("div",{staticClass:"notesText"},[e("div",{staticClass:"notesTitle"},[t._v(t._s(s.content))]),t._v(" "),e("div",{staticClass:"notesTime"},[t._v(t._s(s.date))])])])}),t._v(" "),e("div",{staticClass:"btnAddNotes",on:{click:t.addNotes}},[t._v("+")])],2)},staticRenderFns:[]};var d=e("VU/8")(n,i,!1,function(t){e("tVO1")},"data-v-0666be10",null);s.default=d.exports},tVO1:function(t,s){}});
//# sourceMappingURL=1.49561f78003e0ee625e7.js.map