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
  ArrowRight,
  FileEarmarkPdfFill,
  Pencil as Blog,
  Envelope,
  Coin,
  Chat,
  BlockquoteLeft,
  EnvelopeFill,
  FileTextFill,
} from "react-bootstrap-icons";
import "../../App.css";

function getLogo(type) {
  switch (type) {
    case "email":
      return <EnvelopeFill />;
    case "blog":
      return <FileTextFill />;
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
      return <FileEarmarkPdfFill />;
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
    <div>
      {!tokenInfo.website ? (
        ""
      ) : (
        <div>
          <p className="fw-bold m-0">Official Site:</p>
          <p className="mt-0" style={{ textAlign: "end" }}>
            <a
              href={tokenInfo.website}
              target="_blank"
              rel="noopener"
            >
              <i className="fa-light text-dark fa-browser me-2"></i>
              {tokenInfo.website}
            </a>
          </p>
        </div>
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
        <Row>
          <p className="fw-bold m-0">Social Profiles:</p>
          <p style={{textAlign:"end"}}>
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
          </p>
        </Row>
      )}
    </div>
  );
}
