// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import ClarificationCard from "./ClarificationCard.vue";
const question = {
  qid: "q0",
  question: "Choose a colour",
  choices: ["Blue (Recommended)", "Green"],
};
describe("clarification controls", () => {
  it("renders one button per option and only the inline freeform send", async () => {
    const wrapper = mount(ClarificationCard, { props: { questions: [question], disabled: false } });
    expect(wrapper.findAll("select")).toHaveLength(0);
    expect(wrapper.findAll("button").map((button) => button.text())).toEqual([
      "Blue (Recommended)",
      "Green",
      "Send",
    ]);
    expect(wrapper.get(".clarification-other").findAll("input")).toHaveLength(1);
    expect(wrapper.get(".clarification-other").findAll("button")).toHaveLength(1);
    await wrapper.get("input").setValue("Discarded custom draft");
    await wrapper.get(".clarification-choices button").trigger("click");
    expect(wrapper.emitted("answer")).toEqual([[{ q0: "Blue (Recommended)" }]]);
  });
  it("submits exact freeform text without blank or unrelated answers", async () => {
    const wrapper = mount(ClarificationCard, {
      props: { questions: [question, { qid: "q1", question: "Name?" }], disabled: false },
    });
    await wrapper.findAll("input")[1]!.setValue("My fixture name");
    await wrapper.findAll("form")[1]!.trigger("submit");
    expect(wrapper.emitted("answer")).toEqual([[{ q1: "My fixture name" }]]);
  });
  it("toggles multi-select options and submits only through the inline Send", async () => {
    const wrapper = mount(ClarificationCard, {
      props: { questions: [{ ...question, multi_select: true }], disabled: false },
    });
    const options = wrapper.findAll(".clarification-choices button");
    await options[0]!.trigger("click");
    await options[1]!.trigger("click");
    await options[0]!.trigger("click");
    expect(options.map((button) => button.attributes("aria-pressed"))).toEqual(["false", "true"]);
    expect(wrapper.emitted("answer")).toBeUndefined();
    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("answer")).toEqual([[{ q0: "Green" }]]);
    await options[0]!.trigger("click");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("answer")?.[1]).toEqual([{ q0: "Green, Blue (Recommended)" }]);
  });
  it("does not submit empty answers or actions while disabled", async () => {
    const wrapper = mount(ClarificationCard, { props: { questions: [question], disabled: false } });
    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("answer")).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    await wrapper.get(".clarification-choices button").trigger("click");
    await wrapper.get("input").setValue("Other");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("answer")).toBeUndefined();
  });
});
