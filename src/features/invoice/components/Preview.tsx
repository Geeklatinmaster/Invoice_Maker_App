import ThemeVars from "../../../theme/ThemeVars";
import ProfileThemeBridge from "../../../theme/ProfileThemeBridge";
import TemplateRenderer from "../preview/TemplateRenderer";

export default function Preview(){
  return (
    <>
      <ThemeVars/>
      <ProfileThemeBridge/>
      <TemplateRenderer/>
    </>
  );
}