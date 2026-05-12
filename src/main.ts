import { Plugin } from "obsidian";
import { RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin } from "@codemirror/view";

const FLASH_DURATION_MS = 650;
const MAX_DOM_FLASH_RECTS = 80;

type FlashRange = {
	from: number;
	to: number;
};

const addFlash = StateEffect.define<FlashRange[]>();
const clearFlash = StateEffect.define<void>();

const flashMark = Decoration.mark({
	class: "copy-flasher-editor-highlight",
});

const flashField = StateField.define<DecorationSet>({
	create() {
		return Decoration.none;
	},
	update(decorations, transaction) {
		decorations = decorations.map(transaction.changes);

		for (const effect of transaction.effects) {
			if (effect.is(clearFlash)) {
				decorations = Decoration.none;
			}

			if (effect.is(addFlash)) {
				const builder = new RangeSetBuilder<Decoration>();

				for (const range of effect.value) {
					if (range.from < range.to) {
						builder.add(range.from, range.to, flashMark);
					}
				}

				decorations = builder.finish();
			}
		}

		return decorations;
	},
	provide: (field) => EditorView.decorations.from(field),
});

function copyFlashExtension(durationMs: number) {
	class CopyFlashView {
		private clearTimer: number | null = null;

		constructor(private view: EditorView) {}

		destroy() {
			if (this.clearTimer !== null) {
				window.clearTimeout(this.clearTimer);
			}
		}

		flashCopiedSelection() {
			const ranges = this.view.state.selection.ranges
				.filter((range) => !range.empty)
				.map((range) => ({
					from: range.from,
					to: range.to,
				}));

			if (ranges.length === 0) {
				return;
			}

			if (this.clearTimer !== null) {
				window.clearTimeout(this.clearTimer);
			}

			this.view.dispatch({
				effects: addFlash.of(ranges),
			});

			this.clearTimer = window.setTimeout(() => {
				this.view.dispatch({
					effects: clearFlash.of(),
				});
				this.clearTimer = null;
			}, durationMs);
		}
	}

	const copyFlashViewPlugin = ViewPlugin.define(
		(view) => new CopyFlashView(view),
		{
			eventHandlers: {
				copy(_event, view) {
					const plugin = view.plugin(copyFlashViewPlugin);
					plugin?.flashCopiedSelection();
				},
			},
		}
	);

	return [
		flashField,
		copyFlashViewPlugin,
	];
}

export default class CopyFlasherPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(copyFlashExtension(FLASH_DURATION_MS));

		// CodeMirror handles editor selections. This fallback covers copied text in
		// rendered Markdown or other Obsidian-owned DOM content.
		this.registerDomEvent(document, "copy", (event) => {
			this.flashDomSelection(event);
		}, true);
	}

	private flashDomSelection(event: ClipboardEvent) {
		const target = event.target;

		if (!(target instanceof Element)) {
			return;
		}

		if (target.closest(".cm-editor") !== null) {
			return;
		}

		const selection = window.getSelection();

		if (selection === null || selection.isCollapsed || selection.rangeCount === 0) {
			return;
		}

		const activeRoot = this.app.workspace.containerEl;

		if (selection.anchorNode === null || selection.focusNode === null) {
			return;
		}

		if (!activeRoot.contains(selection.anchorNode) || !activeRoot.contains(selection.focusNode)) {
			return;
		}

		for (let index = 0; index < selection.rangeCount; index += 1) {
			this.flashRange(selection.getRangeAt(index));
		}
	}

	private flashRange(range: Range) {
		const rects = Array.from(range.getClientRects())
			.filter((rect) => rect.width > 0 && rect.height > 0)
			.slice(0, MAX_DOM_FLASH_RECTS);

		for (const rect of rects) {
			const overlay = document.createElement("div");

			overlay.className = "copy-flasher-dom-highlight";
			overlay.style.left = `${rect.left + window.scrollX}px`;
			overlay.style.top = `${rect.top + window.scrollY}px`;
			overlay.style.width = `${rect.width}px`;
			overlay.style.height = `${rect.height}px`;

			document.body.appendChild(overlay);
			window.setTimeout(() => overlay.remove(), FLASH_DURATION_MS);
		}
	}
}
