import { Plugin, Protyle } from "siyuan";
import "@/index.scss";
import { IMenuItem } from "siyuan/types";

import { setBlockAttrs, getBlockAttrs } from "./api";
import { SettingUtils } from "./libs/setting-utils"; //顶栏总面板,和下面配合使用

const STORAGE_NAME = "config";
// const zeroWhite = "​";

// class FootnoteDialog {
//   private dialog: HTMLDialogElement;
//   private protyle: Protyle;
//   private isDragging: boolean = false;
//   private currentX: number;
//   private currentY: number;
//   private initialX: number;
//   private initialY: number;
//   private I18N = {
//     zh_CN: {
//       addFootnote: "添加脚注",
//       footnoteContent: "脚注内容",
//       cancel: "取消",
//       ok: "确定",
//     },
//     en_US: {
//       addFootnote: "Add Footnote",
//       footnoteContent: "Footnote Content",
//       cancel: "Cancel",
//       ok: "OK",
//     },
//   };
// }

export default class QuickAddAlias extends Plugin {
  // 添加工具栏按钮
  updateProtyleToolbar(toolbar: Array<string | IMenuItem>) {
    toolbar.push({
      name: "hello new",
      icon: `iconA`,
      // hotkey: "⇧⌘F",
      tipPosition: "s",
      tip: "当前块别名ctrl+shift+F",
      click: (protyle: Protyle) => {
        this.protyle = protyle.protyle;
        this.当前块别名(this.protyle);
      },
    });
    toolbar.push({
      name: "hello new1",
      icon: `iconMin`,
      // hotkey: "",
      tipPosition: "e",
      tip: "上级块别名",
      click: (protyle: Protyle) => {
        this.protyle = protyle.protyle;
        this.上级块别名(this.protyle);
      },
    });
    toolbar.push({
      name: "hello new1",
      icon: `iconPause`,
      // hotkey: "",
      tipPosition: "e",
      tip: "顶级块别名",
      click: (protyle: Protyle) => {
        this.protyle = protyle.protyle;
        this.顶级块别名(this.protyle);
      },
    });

    return toolbar;
  }

  async onload() {
    //注册快捷键
    this.addCommand({
      langKey: "当前块别名",
      langText: "当前块别名",
      hotkey: "⇧⌘F",
      callback: () => {},
      editorCallback: (protyle: any) => {
        this.protyle = protyle;
        this.当前块别名(this.protyle);
      },
    });

    this.settingUtils = new SettingUtils({
      plugin: this,
      name: STORAGE_NAME,
    });
  }

  onLayoutReady() {}

  onunload() {}

  private async 当前块别名(protyle: IProtyle) {
    //await this.settingUtils.load(); //导入配置
    // 获取当前光标所在块的 ID
    const currentBlockId = protyle.toolbar.range.startContainer.parentElement
      .closest("[data-node-id]")
      ?.getAttribute("data-node-id");
    const currentParentBlockId =
      protyle.toolbar.range.startContainer.parentElement
        .closest(".protyle-wysiwyg > [data-node-id]")
        ?.getAttribute("data-node-id"); // 获取父级块ID

    const getOldAlias = await getBlockAttrs(currentBlockId);

    const oldAlias = getOldAlias.alias;
    // 将oldAlias以逗号为分隔符分割成数组，并去除空字符串
    const aliasesArray = (oldAlias || "").split(",").filter(Boolean);

    // 获取选中文本
    const selectionText = protyle.toolbar.range.toString();
    // 检查selectionText是否已经包含在aliasesArray中
    const alreadyExists = aliasesArray.includes(selectionText);

    // 如果selectionText已经存在，则不添加；如果不存在，则添加到数组中
    const updateAliasArray = alreadyExists
      ? aliasesArray
      : [...aliasesArray, selectionText];

    // 将数组重新连接成以逗号分隔的字符串
    const updateAlias = updateAliasArray.join(",");
    setBlockAttrs(currentBlockId, {
      alias: updateAlias, // 更新别名
    });
  }
  private async 顶级块别名(protyle: IProtyle) {
    //await this.settingUtils.load(); //导入配置
    // 获取当前光标所在块的 ID
    const currentBlockId = protyle.toolbar.range.startContainer.parentElement
      .closest("[data-node-id]")
      ?.getAttribute("data-node-id");
    const currentParentBlockId =
      protyle.toolbar.range.startContainer.parentElement
        .closest(".protyle-wysiwyg > [data-node-id]")
        ?.getAttribute("data-node-id"); // 获取父级块ID

    const getOldAlias = await getBlockAttrs(currentParentBlockId);

    const oldAlias = getOldAlias.alias;
    // 将oldAlias以逗号为分隔符分割成数组，并去除空字符串
    const aliasesArray = (oldAlias || "").split(",").filter(Boolean);

    // 获取选中文本
    const selectionText = protyle.toolbar.range.toString();
    // 检查selectionText是否已经包含在aliasesArray中
    const alreadyExists = aliasesArray.includes(selectionText);

    // 如果selectionText已经存在，则不添加；如果不存在，则添加到数组中
    const updateAliasArray = alreadyExists
      ? aliasesArray
      : [...aliasesArray, selectionText];

    // 将数组重新连接成以逗号分隔的字符串
    const updateAlias = updateAliasArray.join(",");
    setBlockAttrs(currentParentBlockId, {
      alias: updateAlias, // 更新别名
    });
  }
  private async 上级块别名(protyle: IProtyle) {
    //await this.settingUtils.load(); //导入配置
    // 获取当前光标所在块的 ID
    const currentBlock =
      protyle.toolbar.range.startContainer.parentElement.closest(
        "[data-node-id]"
      );
    const currentUpBlockId = currentBlock
      ? currentBlock.parentElement
          .closest("[data-node-id]")
          ?.getAttribute("data-node-id")
      : null;

    const getOldAlias = await getBlockAttrs(currentUpBlockId);

    const oldAlias = getOldAlias.alias;
    // 将oldAlias以逗号为分隔符分割成数组，并去除空字符串
    const aliasesArray = (oldAlias || "").split(",").filter(Boolean);

    // 获取选中文本
    const selectionText = protyle.toolbar.range.toString();
    // 检查selectionText是否已经包含在aliasesArray中
    const alreadyExists = aliasesArray.includes(selectionText);

    // 如果selectionText已经存在，则不添加；如果不存在，则添加到数组中
    const updateAliasArray = alreadyExists
      ? aliasesArray
      : [...aliasesArray, selectionText];

    // 将数组重新连接成以逗号分隔的字符串
    const updateAlias = updateAliasArray.join(",");
    setBlockAttrs(currentUpBlockId, {
      alias: updateAlias, // 更新别名了
    });
  }
}
