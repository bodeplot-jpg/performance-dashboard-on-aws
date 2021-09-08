import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";
import WidgetRender from "./WidgetRender";
import Tabs from "./Tabs";
import TabsVertical from "./TabsVertical";

interface Props {
  widget: Widget;
  showMobilePreview?: boolean;
  widgets?: Array<Widget>;
}

function SectionWidget(props: Props) {
  const { content, showTitle } = props.widget;

  return (
    <div>
      {showTitle && <h1>{content.title}</h1>}
      {content.summary ? (
        <div className="padding-left-05">
          <MarkdownRender
            className="usa-prose textOrSummary"
            source={content.summary}
          />
        </div>
      ) : (
        ""
      )}
      {!props.widget.content.showWithTabs &&
        props.widget.content.widgetIds &&
        props.widget.content.widgetIds.map((id: string, index: number) => {
          const widget = props.widgets?.find((w) => w.id === id);
          if (widget) {
            return (
              <div key={index}>
                <div className="margin-top-6 usa-prose" id={id}>
                  <WidgetRender
                    widget={widget}
                    showMobilePreview={props.showMobilePreview}
                  />
                </div>
              </div>
            );
          }
          return false;
        })}
      {props.widget.content.showWithTabs &&
        props.widget.content.horizontally &&
        props.widget.content.widgetIds && (
          <Tabs defaultActive={"0"} showArrows>
            {props.widget.content.widgetIds.map((id: string, index: number) => {
              const widget = props.widgets?.find((w) => w.id === id);
              if (widget) {
                return (
                  <div key={index} id={`${index}`} label={widget.name}>
                    <WidgetRender
                      widget={widget}
                      showMobilePreview={props.showMobilePreview}
                      hideTitle={true}
                    />
                  </div>
                );
              }
              return false;
            })}
          </Tabs>
        )}
      {props.widget.content.showWithTabs &&
        !props.widget.content.horizontally &&
        props.widget.content.widgetIds && (
          <TabsVertical defaultActive={"0"}>
            {props.widget.content.widgetIds.map((id: string, index: number) => {
              const widget = props.widgets?.find((w) => w.id === id);
              if (widget) {
                return (
                  <div key={index} id={`${index}`} label={widget.name}>
                    <WidgetRender
                      widget={widget}
                      showMobilePreview={props.showMobilePreview}
                      hideTitle={true}
                    />
                  </div>
                );
              }
              return false;
            })}
          </TabsVertical>
        )}
    </div>
  );
}

export default SectionWidget;