import { books } from "./books"

export interface myfavoriteInterface {
    // imageName: string,
    book:books,
    is_favorite: boolean,
    addDate: Date,
    tagName: string,    //把圖片分成不同標籤，使用者尋找的時候可能比較方便
}

