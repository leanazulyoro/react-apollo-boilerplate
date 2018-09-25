import React from 'react';
import config from 'isomorphic-config';
import { Helmet } from 'react-helmet';
import saferstringify from 'safer-stringify';
import HtmlBuilder from './builder/HtmlBuilder';
import { renderToStaticMarkup } from 'react-dom/server';
import project from '../../webpack/project.config';

const renderHtml = (markup, client, styles) => {

  const helmet = Helmet.renderStatic();
  let htmlBuilder = (new HtmlBuilder)
    .withBodyAttrs(helmet.htmlAttributes.toComponent())
    .withHtmlAttrs(helmet.bodyAttributes.toComponent())
    .withHelmet(helmet.title.toComponent())
    .withHelmet(helmet.meta.toComponent())
    .withHelmet(helmet.link.toComponent())
    .withHelmet(helmet.noscript.toComponent())
    .withHelmet(helmet.script.toComponent())
    .withHelmet(helmet.style.toComponent())
    .withFooterTag('script', { charSet: 'UTF-8' }, `window.__APOLLO_STATE__=${saferstringify(client ? client.extract() : {})};`)
    .withFooterTag('script', { charSet: 'UTF-8' }, `var CONFIG=${JSON.stringify({ client: config.client })};`)
    .withFooterTag('script', { defer: true, src: config.client.cdn_static_url + `/vendor.bundle${project.assets.suffix}.js` })
    .withFooterTag('script', { defer: true, src: config.client.cdn_static_url + `/main.bundle${project.assets.suffix}.js` })
    .withMarkup(<main
      id='root'
      dangerouslySetInnerHTML={{ __html: markup }} // eslint-disable-line react/no-danger
    />)
    .withStyles(styles);

  const html = renderToStaticMarkup(htmlBuilder.build());
  return `${html}`;

};

export default renderHtml;
