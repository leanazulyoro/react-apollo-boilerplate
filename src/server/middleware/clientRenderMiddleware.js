import React from "react";
import renderHtml from "../renderHtml";

export default function clientRenderMiddleware(req, res) {
    const statusCode = 200;
    const html = renderHtml("");
    res.status(statusCode);
    res.send(html);
    res.end();
}
