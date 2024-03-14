"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setImage2Model_workflow2 = void 0;
const keepImageNameOnly = () => {
};
const setImage2Model_workflow2 = (image) => {
    let Model3D_workflow2 = {
        "last_node_id": 34,
        "last_link_id": 52,
        "nodes": [
            {
                "id": 9,
                "type": "InvertMask",
                "pos": [
                    576,
                    690
                ],
                "size": {
                    "0": 140,
                    "1": 26
                },
                "flags": {},
                "order": 3,
                "mode": 0,
                "inputs": [
                    {
                        "name": "mask",
                        "type": "MASK",
                        "link": 10
                    }
                ],
                "outputs": [
                    {
                        "name": "MASK",
                        "type": "MASK",
                        "links": [
                            15
                        ],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "InvertMask"
                }
            },
            {
                "id": 14,
                "type": "[Comfy3D] Triplane Gaussian Transformers",
                "pos": [
                    767,
                    631
                ],
                "size": {
                    "0": 252,
                    "1": 98
                },
                "flags": {},
                "order": 4,
                "mode": 0,
                "inputs": [
                    {
                        "name": "reference_image",
                        "type": "IMAGE",
                        "link": 14
                    },
                    {
                        "name": "reference_mask",
                        "type": "MASK",
                        "link": 15
                    },
                    {
                        "name": "tgs_model",
                        "type": "TGS_MODEL",
                        "link": 16
                    }
                ],
                "outputs": [
                    {
                        "name": "gs_ply",
                        "type": "GS_PLY",
                        "links": [
                            17
                        ],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Triplane Gaussian Transformers"
                },
                "widgets_values": [
                    1.9000000000000001
                ]
            },
            {
                "id": 13,
                "type": "[Comfy3D] Switch 3DGS Axis",
                "pos": [
                    1052,
                    631
                ],
                "size": {
                    "0": 210,
                    "1": 106
                },
                "flags": {},
                "order": 5,
                "mode": 0,
                "inputs": [
                    {
                        "name": "gs_ply",
                        "type": "GS_PLY",
                        "link": 17
                    }
                ],
                "outputs": [
                    {
                        "name": "switched_gs_ply",
                        "type": "GS_PLY",
                        "links": [
                            12,
                            51
                        ],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Switch 3DGS Axis"
                },
                "widgets_values": [
                    "-y",
                    "+z",
                    "-x"
                ]
            },
            {
                "id": 34,
                "type": "[Comfy3D] Switch 3DGS Axis",
                "pos": [
                    1294,
                    629
                ],
                "size": {
                    "0": 210,
                    "1": 106
                },
                "flags": {},
                "order": 7,
                "mode": 0,
                "inputs": [
                    {
                        "name": "gs_ply",
                        "type": "GS_PLY",
                        "link": 51
                    }
                ],
                "outputs": [
                    {
                        "name": "switched_gs_ply",
                        "type": "GS_PLY",
                        "links": [
                            52
                        ],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Switch 3DGS Axis"
                },
                "widgets_values": [
                    "+x",
                    "-y",
                    "-z"
                ]
            },
            {
                "id": 33,
                "type": "[Comfy3D] Convert 3DGS to Mesh with NeRF and Marching Cubes",
                "pos": [
                    1531,
                    629
                ],
                "size": {
                    "0": 411.6000061035156,
                    "1": 82
                },
                "flags": {},
                "order": 8,
                "mode": 0,
                "inputs": [
                    {
                        "name": "gs_ply",
                        "type": "GS_PLY",
                        "link": 52
                    }
                ],
                "outputs": [
                    {
                        "name": "mesh",
                        "type": "MESH",
                        "links": [
                            50
                        ],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Convert 3DGS to Mesh with NeRF and Marching Cubes"
                },
                "widgets_values": [
                    "big",
                    false
                ]
            },
            {
                "id": 2,
                "type": "[Comfy3D] Load Triplane Gaussian Transformers",
                "pos": [
                    444,
                    768
                ],
                "size": {
                    "0": 294,
                    "1": 58
                },
                "flags": {},
                "order": 0,
                "mode": 0,
                "outputs": [
                    {
                        "name": "tgs_model",
                        "type": "TGS_MODEL",
                        "links": [
                            16
                        ],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Load Triplane Gaussian Transformers"
                },
                "widgets_values": [
                    "model_lvis_rel.ckpt"
                ]
            },
            {
                "id": 11,
                "type": "Note",
                "pos": [
                    919,
                    424
                ],
                "size": {
                    "0": 347.9384460449219,
                    "1": 141.6276092529297
                },
                "flags": {},
                "order": 1,
                "mode": 0,
                "title": "Switch 3DGS Axis Note",
                "properties": {
                    "text": ""
                },
                "widgets_values": [
                    "Triplane Gaussian Transformers to Preview:\n  axis x to: -y\n  axis y to: +z\n  axis z to: -x\n\nGaussian Splatting to Preview:\n  axis x to: +x\n  axis y to: -y\n  axis z to: -z"
                ],
                "color": "#432",
                "bgcolor": "#653"
            },
            {
                "id": 25,
                "type": "[Comfy3D] Save 3D Mesh",
                "pos": [
                    1974,
                    629
                ],
                "size": {
                    "0": 315,
                    "1": 58
                },
                "flags": {},
                "order": 9,
                "mode": 0,
                "inputs": [
                    {
                        "name": "mesh",
                        "type": "MESH",
                        "link": 50
                    }
                ],
                "outputs": [
                    {
                        "name": "save_path",
                        "type": "STRING",
                        "links": [],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Save 3D Mesh"
                },
                "widgets_values": [
                    "MeshTest\\a.obj"
                ]
            },
            {
                "id": 4,
                "type": "LoadImage",
                "pos": [
                    47,
                    632
                ],
                "size": {
                    "0": 354.32330322265625,
                    "1": 315.4895935058594
                },
                "flags": {},
                "order": 2,
                "mode": 0,
                "outputs": [
                    {
                        "name": "IMAGE",
                        "type": "IMAGE",
                        "links": [
                            14
                        ],
                        "shape": 3,
                        "slot_index": 0
                    },
                    {
                        "name": "MASK",
                        "type": "MASK",
                        "links": [
                            10
                        ],
                        "shape": 3,
                        "slot_index": 1
                    }
                ],
                "properties": {
                    "Node name for S&R": "LoadImage"
                },
                "widgets_values": [
                    `remoteSave/${image}`,
                    "image"
                ]
            },
            {
                "id": 10,
                "type": "[Comfy3D] Save 3DGS",
                "pos": [
                    1287,
                    807
                ],
                "size": {
                    "0": 275.57391357421875,
                    "1": 58
                },
                "flags": {},
                "order": 6,
                "mode": 0,
                "inputs": [
                    {
                        "name": "gs_ply",
                        "type": "GS_PLY",
                        "link": 12
                    }
                ],
                "outputs": [
                    {
                        "name": "save_path",
                        "type": "STRING",
                        "links": [],
                        "shape": 3,
                        "slot_index": 0
                    }
                ],
                "properties": {
                    "Node name for S&R": "[Comfy3D] Save 3DGS"
                },
                "widgets_values": [
                    `MeshTest/a.ply`
                ]
            }
        ],
        "links": [
            [
                10,
                4,
                1,
                9,
                0,
                "MASK"
            ],
            [
                12,
                13,
                0,
                10,
                0,
                "GS_PLY"
            ],
            [
                14,
                4,
                0,
                14,
                0,
                "IMAGE"
            ],
            [
                15,
                9,
                0,
                14,
                1,
                "MASK"
            ],
            [
                16,
                2,
                0,
                14,
                2,
                "TGS_MODEL"
            ],
            [
                17,
                14,
                0,
                13,
                0,
                "GS_PLY"
            ],
            [
                50,
                33,
                0,
                25,
                0,
                "MESH"
            ],
            [
                51,
                13,
                0,
                34,
                0,
                "GS_PLY"
            ],
            [
                52,
                34,
                0,
                33,
                0,
                "GS_PLY"
            ]
        ],
        "groups": [],
        "config": {},
        "extra": {},
        "version": 0.4
    };
    return Model3D_workflow2;
};
exports.setImage2Model_workflow2 = setImage2Model_workflow2;
