namespace Matrix {
    export class Generator {
        private maps: number[][];

        constructor() {
            this.maps = this.initMaps();
            this.calculateMap();
            this.render();
        }

        private initMaps(): number[][] {
            const result = [];
            for (let i = 0; i < 7; i++) {
                result.push(Array(7).fill(0));
            }

            return result;
        }

        private calculateMap(): void {
            const queue: TwoDimension[] = [{x: 3, y: 3}];

            // first enterance
            this.maps[3][3]++;

            // first room
            const firstRoom = this.getWay({x: 3, y: 3}, 3);
            firstRoom.forEach((way: TwoDimension) => {
                this.maps[way.y][way.x] += 2;
                queue.push(way);
            });

            // second room
            const secondRoom: TwoDimension[] = [];
            firstRoom.forEach((way: TwoDimension) => this.getWay(way, 2, queue).forEach((result: TwoDimension) => {
                secondRoom.push(result);
                queue.push(result);
            }));

            // third room
            const thirdRoom: TwoDimension[] = [];
            this.popRandom(secondRoom, 2).forEach((way: TwoDimension) => {
                if (!way) return;
                this.maps[way.y][way.x] += 3;
                queue.push(way);
                this.getWay(way, 1, queue).forEach((result: TwoDimension) => thirdRoom.push(result));
            });
            
            this.popRandom(thirdRoom, 1).forEach((way: TwoDimension) => this.maps[way.y][way.x] += 4);
        }

        private getWay(start: TwoDimension, gate: number, excludes?: TwoDimension[]): TwoDimension[] {
            const queue = this.getWayQueue(start, excludes);
            return this.popRandom(queue, gate);
        }

        private popRandom(list: TwoDimension[], count: number): TwoDimension[] {
            const result = [];
            let index: number = 0;

            for (let i = 0; i < count; i++) {
                index = Math.floor(Math.random() * list.length);
                result.push(list[index]);
                list.splice(index, 1);
            }

            return result;
        }

        private getWayQueue(start: TwoDimension, excludes?: TwoDimension[]): TwoDimension[] {
            const original = [
                {x: start.x - 1, y: start.y},
                {x: start.x + 1, y: start.y},
                {x: start.x, y: start.y - 1},
                {x: start.x, y: start.y + 1}
            ];

            if (excludes) {
                return original.filter(n => typeof (excludes.find(exclude => exclude && exclude.x === n.x && exclude.y === n.y)) === 'undefined');
            }

            return original;
        }

        render(): void {
            const rows: string[] = [];
            this.maps.forEach((row: number[], index: number) => {
                const cols: string[] = [`<th>${index}</th>`];
                row.forEach((col: number) => {
                    cols.push(`<td class='${0 < col && `col-${col}` || ''}'>${col}</td>`);
                });

                rows.push(`<tr>${cols.join('')}</tr>`);
            });
            
            document.body.innerHTML = `<table><thead><tr><th>/</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
        }
    } 
}

new Matrix.Generator();