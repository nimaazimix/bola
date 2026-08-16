import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@bola/ui/components/message-scroller";
import { Message } from "@bola/ui/components/message";
import { Bubble, BubbleContent } from "@bola/ui/components/bubble";
import { Composer } from "./composer";

export function BoardViewport() {
  return (
    <div className="flex h-full flex-col">
      <MessageScrollerProvider>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto max-w-200 p-4">
              <MessageScrollerItem>
                <Message align="end">
                  <Bubble variant="tinted">
                    <BubbleContent>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita, deleniti
                      voluptatum aspernatur rem amet non ea accusantium animi nesciunt ad ipsam
                      dolore dolorem ducimus repellat iusto doloremque. Neque, non quis. At
                      veritatis fugit fuga adipisci provident consequuntur eum dolores optio totam
                      ratione error vel quidem est minima repellat quos repudiandae minus mollitia,
                      aperiam velit. Facilis eaque in aut pariatur accusamus.
                    </BubbleContent>
                  </Bubble>
                </Message>
              </MessageScrollerItem>
              <MessageScrollerItem>
                <Message>
                  <Bubble variant="outline">
                    <BubbleContent>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita, deleniti
                      voluptatum aspernatur rem amet non ea accusantium animi nesciunt ad ipsam
                      dolore dolorem ducimus repellat iusto doloremque. Neque, non quis. At
                      veritatis fugit fuga adipisci provident consequuntur eum dolores optio totam
                      ratione error vel quidem est minima repellat quos repudiandae minus mollitia,
                      aperiam velit. Facilis eaque in aut pariatur accusamus.
                    </BubbleContent>
                  </Bubble>
                </Message>
              </MessageScrollerItem>
              <MessageScrollerItem>
                <Message align="end">
                  <Bubble variant="tinted">
                    <BubbleContent>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita, deleniti
                      voluptatum aspernatur rem amet non ea accusantium animi nesciunt ad ipsam
                      dolore dolorem ducimus repellat iusto doloremque. Neque, non quis. At
                      veritatis fugit fuga adipisci provident consequuntur eum dolores optio totam
                      ratione error vel quidem est minima repellat quos repudiandae minus mollitia,
                      aperiam velit. Facilis eaque in aut pariatur accusamus.
                    </BubbleContent>
                  </Bubble>
                </Message>
              </MessageScrollerItem>
              <MessageScrollerItem>
                <Message>
                  <Bubble variant="outline">
                    <BubbleContent>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita, deleniti
                      voluptatum aspernatur rem amet non ea accusantium animi nesciunt ad ipsam
                      dolore dolorem ducimus repellat iusto doloremque. Neque, non quis. At
                      veritatis fugit fuga adipisci provident consequuntur eum dolores optio totam
                      ratione error vel quidem est minima repellat quos repudiandae minus mollitia,
                      aperiam velit. Facilis eaque in aut pariatur accusamus.
                    </BubbleContent>
                  </Bubble>
                </Message>
              </MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>

      <Composer />
    </div>
  );
}
