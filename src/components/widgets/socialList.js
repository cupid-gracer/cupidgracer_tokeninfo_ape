import React from "react";
import { Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
  Reddit,
  Slack,
  Facebook,
  Twitter,
  Github,
  Telegram,
  Linkedin,
  Discord,
  File as Whitepaer,
  Pencil as Blog,
  Mailbox,
  Coin,
  Chat,
} from "react-bootstrap-icons";
import "../../App.css";

function getLogo(type) {
  switch (type) {
    case "email":
      return <Mailbox />;
    case "blog":
      return <Blog />;
    case "reddit":
      return <Reddit />;
    case "slack":
      return <Slack />;
    case "facebook":
      return <Facebook />;
    case "twitter":
      return <Twitter />;
    case "github":
      return <Github />;
    case "telegram":
      return <Telegram />;
    case "linkedin":
      return <Linkedin />;
    case "discord":
      return <Discord />;
    case "whitepaper":
      return <Whitepaer />;
    case "wechat":
      return <Chat />;
    case "bitcointalk":
      return <Coin />;
    default:
      return <div></div>;
  }
}

function cellSocial(socialLink, type) {
  return !socialLink ? (
    ""
  ) : (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="tooltip-top">
          {type.charAt(0).toUpperCase() + type.slice(1) + ": \n" + socialLink}
        </Tooltip>
      }
    >
        <a
          // ref={ref}
          className="socialItem"
          href={type == "email" ? "mailto:" + socialLink : socialLink}
          target="_blank"
          style={{ marginRight: "5px", padding: "0px" }}
        >
          {getLogo(type)}
        </a>
    </OverlayTrigger>
  );
}

export default function SocialList(props) {
  const tokenInfo = props.tokenInfo;

  return (
    <div style={{ marginTop: "10px" }}>
      {!tokenInfo.website ? (
        ""
      ) : (
        <Row style={{ marginTop: "10px", display: "inline-block" }}>
          <p style={{ padding: "0px", display: "contents" }}>Official Site:</p>
          <a
            href={tokenInfo.website}
            target="_blank"
            style={{ marginLeft: "20px" }}
          >
            {tokenInfo.website}
          </a>
        </Row>
      )}
      {!tokenInfo.email &&
      !tokenInfo.blog &&
      !tokenInfo.reddit &&
      !tokenInfo.slack &&
      !tokenInfo.facebook &&
      !tokenInfo.twitter &&
      !tokenInfo.github &&
      !tokenInfo.telegram &&
      !tokenInfo.wechat &&
      !tokenInfo.linkedin &&
      !tokenInfo.whitepaper &&
      !tokenInfo.discord ? (
        ""
      ) : (
        <Row style={{ marginTop: "10px", display: "inline-block" }}>
          <p style={{ padding: "0px", display: "contents" }}>
            Social Profiles:
          </p>

          <Row style={{ marginLeft: "10px", display: "inline" }}>
            {cellSocial(tokenInfo.email, "email")}
            {cellSocial(tokenInfo.blog, "blog")}
            {cellSocial(tokenInfo.reddit, "reddit")}
            {cellSocial(tokenInfo.slack, "slack")}
            {cellSocial(tokenInfo.facebook, "facebook")}
            {cellSocial(tokenInfo.twitter, "twitter")}
            {cellSocial(tokenInfo.github, "github")}
            {cellSocial(tokenInfo.telegram, "telegram")}
            {cellSocial(tokenInfo.wechat, "wechat")}
            {cellSocial(tokenInfo.linkedin, "linkedin")}
            {cellSocial(tokenInfo.discord, "discord")}
            {cellSocial(tokenInfo.whitepaper, "whitepaper")}
          </Row>
        </Row>
      )}
    </div>
  );
}
